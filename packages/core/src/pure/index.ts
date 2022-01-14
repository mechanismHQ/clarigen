import { ClarityAbiFunction, ClarityValue } from 'micro-stacks/clarity';
import { ClarityAbi, transformArgsToCV } from '../clarity-types';
import { toCamelCase } from '../utils';

export interface ContractCall<T> {
  function: ClarityAbiFunction;
  nativeArgs: any[];
  functionArgs: ClarityValue[];
}

export interface PureContractInfo {
  abi: ClarityAbi;
  contractAddress: string;
  contractName: string;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ContractCalls {
  export type ReadOnly<T> = ContractCall<T>;
  export type Public<T> = ContractCall<T>;
  export type Private<T> = ContractCall<T>;
}

export function transformFunction<T>(func: ClarityAbiFunction, args: any[]): ContractCall<T> {
  const functionArgs = transformArgsToCV(func, args);
  return {
    function: func,
    functionArgs,
    nativeArgs: args,
  };
}

function getter<T>(
  contract: PureContractInfo,
  property: string | symbol
): (args: any[]) => ContractCall<T> {
  const foundFunction = contract.abi.functions.find(func => toCamelCase(func.name) === property);
  if (!foundFunction)
    throw new Error(`Invalid function call: no function exists for ${String(property)}`);
  return (...args: any[]) => transformFunction(foundFunction, args);
  // TODO: maps, variables, tokens
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
