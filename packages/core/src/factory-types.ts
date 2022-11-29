import { ClarityValue } from 'micro-stacks/clarity';
import { ClarityAbiFunction, TypedAbi, TypedAbiArg, TypedAbiFunction } from './abi-types';

export interface ContractCall<T> {
  function: ClarityAbiFunction;
  nativeArgs: any[];
  functionArgs: ClarityValue[];
  contractAddress: string;
  contractName: string;
  _r?: T;
}

export interface ContractCallTyped<Args extends UnknownArgs, R>
  extends Omit<ContractCall<R>, 'nativeArgs'> {
  nativeArgs: ArgsType<Args>;
}

export type ContractFunctions = {
  [key: string]: TypedAbiFunction<UnknownArgs, unknown>;
};

export type AllContracts = Record<string, TypedAbi>;

// Function builder types

// // Args

type UnknownArg = TypedAbiArg<unknown, string>;
type UnknownArgs = UnknownArg[];

export type ArgsTuple<T extends UnknownArgs> = {
  [K in keyof T]: T[K] extends TypedAbiArg<infer A, string> ? A : never;
};

type ArgsRecordUnion<T extends TypedAbiArg<unknown, string>> = T extends TypedAbiArg<
  infer A,
  infer N
>
  ? {
      [K in T as N]: A;
    }
  : never;
type InnerUnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;
type Compact<T> = { [K in keyof T]: T[K] };

export type UnionToIntersection<T> = Compact<InnerUnionToIntersection<T>>;

export type ArgsRecord<T extends UnknownArgs> = UnionToIntersection<ArgsRecordUnion<T[number]>>;

export type ArgsType<T extends UnknownArgs> = [ArgsRecord<T>] | ArgsTuple<T>;

// // Contract calls

export type ContractCallFunction<Args extends UnknownArgs, R> = {
  (...args: ArgsType<Args>): ContractCallTyped<Args, R>;
  abi: TypedAbiFunction<Args, R>;
};

export type FnToContractCall<T> = T extends TypedAbiFunction<infer Arg, infer R>
  ? ContractCallFunction<Arg, R>
  : never;

// Contract factory types
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

export type FullContract<T> = T extends TypedAbi
  ? FunctionsToContractCalls<T['functions']> & T & { identifier: string } & { contractFile: string }
  : never;

export type ContractFactory<T extends AllContracts> = {
  [key in keyof T]: FullContract<T[key]>;
};
