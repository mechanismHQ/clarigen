import { ClarityAbiFunction, ClarityValue } from 'micro-stacks/clarity';
import { TypedAbi, TypedAbiFunction } from '../src/abi-types';
import {
  Batch,
  DeploymentPlan,
  flatBatch,
  getContractTxs,
  getDeploymentContract,
  getDeploymentTxPath,
  getIdentifier,
  Transaction,
} from './deployment';
import { transformArgsToCV } from './clarity-types';
import { toCamelCase } from './utils';
import {
  AllContracts,
  ContractFactory,
  ContractFunctions,
  FunctionsToContractCalls,
  FnToContractCall,
  FullContract,
} from './factory-types';

export function contractsFactory<T extends AllContracts>(
  contracts: T,
  deployer: string
): ContractFactory<T> {
  return Object.fromEntries(
    Object.entries(contracts).map(([contractName, contract]) => {
      const identifier = `${deployer}.${contract.contractName}`;
      return [contractName, contractFactory(contract, identifier)];
    })
  ) as ContractFactory<T>;
}

export function functionsFactory<T extends ContractFunctions>(
  functions: T,
  identifier: string
): FunctionsToContractCalls<T> {
  return Object.fromEntries(
    Object.entries(functions).map(([fnName, foundFunction]) => {
      const fn: FnToContractCall<typeof foundFunction> = (
        ...args: unknown[] | [Record<string, unknown>]
      ) => {
        const functionArgs = transformArgsToCV(foundFunction, args);
        const [contractAddress, contractName] = identifier.split('.');
        return {
          functionArgs: functionArgs,
          contractAddress,
          contractName,
          function: foundFunction,
          nativeArgs: args,
        };
      };
      return [fnName, fn];
    })
  ) as FunctionsToContractCalls<T>;
}

export function contractFactory<T extends TypedAbi>(abi: T, identifier: string) {
  const full = { ...abi } as FullContract<T>;
  full.identifier = identifier;
  return {
    ...functionsFactory(abi.functions, identifier),
    ...full,
  };
}

export function deploymentFactory<T extends AllContracts>(
  contracts: T,
  deployer: DeploymentPlan
): ContractFactory<T> {
  const result = {} as Partial<ContractFactory<T>>;
  const txs = getContractTxs(deployer.plan.batches as Batch<Transaction>[]);
  txs.forEach(tx => {
    const id = getIdentifier(tx);
    const [contractAddress, contractFileName] = id.split('.');
    const contractName = toCamelCase(contractFileName) as keyof T;
    const def = contracts[contractName] as TypedAbi;
    const final = contracts[contractName] as FullContract<T[keyof T]>;
    if (typeof final === 'undefined') {
      throw new Error(`Clarigen error: mismatch for contract '${contractName as string}'`);
    }
    result[contractName] = final;
    final.contractFile = getDeploymentTxPath(tx);
    final.identifier = id;
    Object.keys(contracts[contractName].functions).forEach(_fnName => {
      const fnName: keyof typeof def['functions'] = _fnName;
      const fn = ((...args: any[]) => {
        const foundFunction = def.functions[fnName];
        const functionArgs = transformArgsToCV(foundFunction, args);
        return {
          functionArgs: functionArgs,
          contractAddress: contractAddress,
          contractName: final.contractName,
          function: foundFunction,
          nativeArgs: args,
        };
      }) as FnToContractCall<typeof def['functions']>;
      final[fnName as keyof typeof result[typeof contractName]] = fn;
    });
  });
  return result as ContractFactory<T>;
}
