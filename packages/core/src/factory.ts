import { ClarityAbiFunction, ClarityValue } from 'micro-stacks/clarity';
import { TypedAbi, TypedAbiFunction } from '../src/abi-types';
import { transformArguments } from './pure';

export interface ContractCall<T> {
  function: ClarityAbiFunction;
  nativeArgs: any[];
  functionArgs: ClarityValue[];
  contractAddress: string;
  contractName: string;
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
  ? T & FunctionsToContractCalls<T['functions']> & { identifier: string }
  : never;

export type ContractFactory<T extends AllContracts> = {
  [key in keyof T]: FullContract<T[key]>;
};

type UnknownContractCallFunction = ContractCallFunction<unknown[], unknown>;

export function contractFactory<T extends AllContracts>(
  contracts: T,
  deployer: string
): ContractFactory<T> {
  const result = contracts as ContractFactory<T>;
  Object.keys(contracts).forEach(contractName => {
    result[contractName].identifier = `${deployer}.${contractName}`;
    const contract = contracts[contractName];
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
