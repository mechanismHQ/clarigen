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
import { transformArguments } from './pure';
import { toCamelCase } from './utils';

export interface ContractCall<T> {
  function: ClarityAbiFunction;
  nativeArgs: any[];
  functionArgs: ClarityValue[];
  contractAddress: string;
  contractName: string;
  _r?: T;
}

export interface ContractCallTyped<Args, R> extends Omit<ContractCall<R>, 'nativeArgs'> {
  nativeArgs: Args;
}

export type ContractFunctions = {
  [key: string]: TypedAbiFunction<unknown[], unknown>;
};

export type AllContracts = Record<string, TypedAbi>;

export type ContractCallFunction<Args extends any[], R> = (
  ...args: Args
) => ContractCallTyped<Args, R>;

export type FnToContractCall<T> = T extends TypedAbiFunction<infer Arg, infer R>
  ? ContractCallFunction<Arg, R>
  : never;

export type FunctionsToContractCalls<T> = T extends ContractFunctions
  ? {
      [key in keyof T]: FnToContractCall<T[key]>;
    }
  : never;

export type FullContract<T> = T extends TypedAbi
  ? T & FunctionsToContractCalls<T['functions']> & { identifier: string } & { contractFile: string }
  : never;

export type ContractFactory<T extends AllContracts> = {
  [key in keyof T]: FullContract<T[key]>;
};

type UnknownContractCallFunction = ContractCallFunction<unknown[], unknown>;

export function contractFactory<T extends AllContracts>(
  contracts: T,
  deployer: string | DeploymentPlan
): ContractFactory<T> {
  const result = contracts as ContractFactory<T>;
  Object.keys(contracts).forEach(contractName => {
    const contract = contracts[contractName];
    if (typeof deployer === 'string') {
      result[contractName].identifier = `${deployer}.${contractName}`;
    } else {
      const tx = getDeploymentContract(contract.contractName, deployer);
      result[contractName].contractFile = getDeploymentTxPath(tx);
      result[contractName].identifier = getIdentifier(tx);
    }
    Object.keys(contracts[contractName].functions).forEach(_fnName => {
      const fnName: keyof typeof contract['functions'] = _fnName;
      const fn = ((...args: any[]) => {
        const foundFunction = contract.functions[fnName];
        const functionArgs = transformArguments(foundFunction, args);
        return {
          functionArgs: functionArgs,
          contractAddress: deployer,
          contractName: contract.contractName,
          function: foundFunction,
          nativeArgs: args,
        };
      }) as FnToContractCall<typeof contract['functions']>;
      result[contractName][fnName as keyof typeof result[typeof contractName]] = fn;
    });
  });
  return result;
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
    result[contractName] = final;
    final.contractFile = getDeploymentTxPath(tx);
    final.identifier = id;
    Object.keys(contracts[contractName].functions).forEach(_fnName => {
      const fnName: keyof typeof def['functions'] = _fnName;
      const fn = ((...args: any[]) => {
        const foundFunction = def.functions[fnName];
        const functionArgs = transformArguments(foundFunction, args);
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
