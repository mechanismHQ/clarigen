import { ClarityAbi } from './clarity-types';
import { TypedAbiArg, TypedAbiFunction } from './abi-types';
import { ArgsRecord, ArgsTuple } from './factory-types';

export type Kebab<T extends string, A extends string = ''> = T extends `${infer F}${infer R}`
  ? Kebab<R, `${A}${F extends Lowercase<F> ? '' : '-'}${Lowercase<F>}`>
  : A;

export type KebabObject<T> = T extends Uint8Array
  ? T
  : T extends Record<string, unknown>
  ? {
      [K in keyof T as K extends string ? Kebab<K> : K]: KebabObject<T[K]>;
    }
  : T;

export type ExtractArgs<F> = F extends TypedAbiFunction<infer Args, unknown>
  ? ArgsTuple<Args>
  : never;

export type ExtractArgsRecord<F> = F extends TypedAbiFunction<infer Args, unknown>
  ? ArgsRecord<Args>
  : never;

export type ContractBuilder<T> = (contractAddress: string, contractName: string) => T;

export interface Contract<T> {
  address: string;
  contractFile: string;
  contract: ContractBuilder<T>;
  abi: ClarityAbi;
  name: string;
}

export interface Contracts<T> {
  [key: string]: Contract<T>;
}

export interface ContractInstance<T> {
  identifier: string;
  contract: T;
}

export type ContractInstances<T extends Contracts<any>> = {
  [Name in keyof T]: ContractInstance<ReturnType<T[Name]['contract']>>;
};
