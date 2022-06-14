import { ClarityAbiFunction, ClarityValue } from 'micro-stacks/clarity';
import { TypedAbiFunction } from '../src/abi-types';
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

export type AllContracts = {
  [contractName: string]: {
    functions: ContractFunctions;
    [key: string]: any;
  };
};

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

export type ContractsToContractCalls<T> = T extends AllContracts
  ? {
      [key in keyof T]: FunctionsToContractCalls<T[key]['functions']>;
    }
  : never;

type UnknownContractCallFunction = ContractCallFunction<unknown[], unknown>;

export function contractFactory<T extends AllContracts>(contracts: T): ContractsToContractCalls<T> {
  const result = {} as Record<keyof T, Record<string, UnknownContractCallFunction>>;
  Object.keys(contracts).forEach(contractName => {
    result[contractName as keyof typeof contracts] = {} as Record<
      string,
      UnknownContractCallFunction
    >;
    const contract = contracts[contractName];
    Object.keys(contracts[contractName].functions).forEach(fnName => {
      const fn = (...args: any[]) => {
        const foundFunction = contract.functions[fnName];
        const functionArgs = transformArguments(foundFunction, args);
        return {
          functionArgs: functionArgs,
          // TODO
          contractAddress: '',
          contractName: contract.contractName,
          function: foundFunction,
          nativeArgs: args,
        };
      };
      result[contractName][fnName] = fn;
    });
  });
  return result as ContractsToContractCalls<T>;
}
