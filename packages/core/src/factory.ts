import { ClarityAbiFunction, ClarityValue } from 'micro-stacks/clarity';
import { TypedAbi, TypedAbiFunction, TypedAbiMap } from '../src/abi-types';
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
import { CVInput, parseToCV, transformArgsToCV } from './clarity-types';
import { toCamelCase } from './utils';
import {
  AllContracts,
  ContractFactory,
  ContractFunctions,
  FunctionsToContractCalls,
  FnToContractCall,
  FullContract,
} from './factory-types';

export const DEPLOYMENT_NETWORKS = ['devnet', 'simnet', 'testnet', 'mainnet'] as const;
export type DeploymentNetwork = typeof DEPLOYMENT_NETWORKS[number];

export type DeploymentsForContracts<C extends AllContracts> = {
  [K in keyof C]: ContractDeployments;
};

export type ContractDeployments = {
  [key in DeploymentNetwork]: string | null;
};

export type Project<C extends AllContracts, D extends DeploymentsForContracts<C>> = {
  contracts: C;
  deployments: D;
};

export type FullContractWithIdentifier<C extends TypedAbi, Id extends string> = FullContract<C> & {
  identifier: Id;
};

export type ProjectFactory<P extends Project<any, any>, N extends DeploymentNetwork> = {
  [ContractName in keyof P['contracts']]: P['deployments'][ContractName][N] extends string
    ? FullContractWithIdentifier<P['contracts'][ContractName], P['deployments'][ContractName][N]>
    : undefined;
};

export function projectFactory<
  P extends Project<C, D>,
  N extends DeploymentNetwork,
  C extends AllContracts,
  D extends DeploymentsForContracts<C>
>(project: P, network: N): ProjectFactory<P, N> {
  const e: [keyof C, FullContract<TypedAbi>][] = [];
  Object.entries(project.contracts).forEach(([contractName, contract]) => {
    const id = project.deployments[contractName][network];
    if (id) {
      e.push([contractName, contractFactory(contract, id)]);
    }
    return false;
  });
  return Object.fromEntries(e) as ProjectFactory<P, N>;
}

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
      const fn: FnToContractCall<typeof foundFunction> = Object.assign(
        (...args: unknown[] | [Record<string, unknown>]) => {
          const functionArgs = transformArgsToCV(foundFunction, args);
          const [contractAddress, contractName] = identifier.split('.');
          return {
            functionArgs: functionArgs,
            contractAddress,
            contractName,
            function: foundFunction,
            functionName: foundFunction.name,
            nativeArgs: args,
          };
        },
        { abi: foundFunction }
      );
      return [fnName, fn];
    })
  ) as FunctionsToContractCalls<T>;
}

export function contractFactory<T extends TypedAbi, Id extends string>(
  abi: T,
  identifier: Id
): FullContractWithIdentifier<T, Id> {
  const full = { ...abi } as FullContract<T>;
  return {
    ...functionsFactory(abi.functions, identifier),
    ...full,
    identifier: identifier,
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

export type MapFactory<M extends TypedAbiMap<K, V>, K, V> = {
  key: K;
  _v?: V;
  keyCV: ClarityValue;
  map: M;
};

export function mapFactory<Key, Val>(map: TypedAbiMap<Key, Val>, key: Key) {
  const keyCV = parseToCV(key as CVInput, map.key);
  const mapFactory: MapFactory<typeof map, Key, Val> = {
    key,
    keyCV,
    map,
  };
  return mapFactory;
}
