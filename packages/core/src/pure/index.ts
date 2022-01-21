import { ClarityAbiFunction, ClarityValue } from 'micro-stacks/clarity';
import { Result } from 'neverthrow';
import { ClarityTypes } from '..';
import { ClarityAbi, ClarityAbiMap, parseToCV, transformArgsToCV } from '../clarity-types';
import { toCamelCase } from '../utils';

export interface ContractCall<T> {
  function: ClarityAbiFunction;
  nativeArgs: any[];
  functionArgs: ClarityValue[];
  contractAddress: string;
  contractName: string;
}

export interface PureContractInfo {
  abi: ClarityAbi;
  contractAddress: string;
  contractName: string;
}

export type ContractFn<T> = (args: any) => T;

export type ContractReturn<
  C extends ContractFn<ContractCalls.ReadOnly<any>>
  // C
> = C extends ContractFn<ContractCalls.ReadOnly<infer T>> ? T : unknown;

export type ContractReturnOk<
  C extends ContractFn<ContractCalls.ReadOnly<any>>
> = ContractReturn<C> extends Result<infer O, any> ? O : unknown;

export type ContractReturnErr<
  C extends ContractFn<ContractCalls.ReadOnly<any>>
> = ContractReturn<C> extends Result<any, infer E> ? E : unknown;

export interface MapGet<Key, Val> {
  map: ClarityAbiMap;
  nativeKey: Key;
  key: ClarityValue;
  contractAddress: string;
  contractName: string;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ContractCalls {
  export type ReadOnly<T> = ContractCall<T>;
  export type Public<Ok, Err> = ContractCall<ClarityTypes.Response<Ok, Err>>;
  export type Private<T> = ContractCall<T>;
  export type Map<Key, Val> = MapGet<Key, Val>;
}

export function transformArguments(func: ClarityAbiFunction, args: any[]): ClarityValue[] {
  return transformArgsToCV(func, args);
}

function getter<T>(
  contract: PureContractInfo,
  property: string | symbol
): (...args: any) => ContractCall<T> | MapGet<any, T> {
  const foundFunction = contract.abi.functions.find(func => toCamelCase(func.name) === property);
  if (foundFunction) {
    return function (...args: any[]) {
      const functionArgs = transformArguments(foundFunction, args);
      return {
        functionArgs: functionArgs,
        contractAddress: contract.contractAddress,
        contractName: contract.contractName,
        function: foundFunction,
        nativeArgs: args,
      };
    };
  }
  const foundMap = contract.abi.maps.find(map => toCamelCase(map.name) === property);
  if (foundMap) {
    return (key: any) => {
      const keyCV = parseToCV(key, foundMap.key);
      const mapGet: MapGet<any, T> = {
        contractAddress: contract.contractAddress,
        contractName: contract.contractName,
        map: foundMap,
        nativeKey: key,
        key: keyCV,
      };
      return mapGet;
    };
  }
  // TODO: variables, tokens
  throw new Error(`Invalid function call: no function exists for ${String(property)}`);
}

export const proxyHandler: ProxyHandler<PureContractInfo> = {
  get: getter,
};

interface ProxyConstructor {
  revocable<T extends object, S extends object>(
    target: T,
    handler: ProxyHandler<S>
  ): { proxy: T; revoke: () => void };
  new <T extends object>(target: T, handler: ProxyHandler<T>): T;
  new <T extends object, S extends object>(target: S, handler: ProxyHandler<S>): T;
}
declare const Proxy: ProxyConstructor;

export const pureProxy = <T extends object>(target: PureContractInfo): T => {
  return new Proxy<T, PureContractInfo>(target, proxyHandler);
};
