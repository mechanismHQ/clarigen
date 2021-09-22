import type { BaseProvider } from './base-provider';

export type ContractBuilder<T> = (provider: BaseProvider) => T;
export interface Contract<T> {
  address: string;
  contractFile: string;
  contract: ContractBuilder<T>;
  name?: string;
}

export interface Contracts<T> {
  [key: string]: Contract<T>;
}

export interface ContractInstance<T> {
  identifier: string;
  contract: T;
}

export type ContractInstances<T extends Contracts<M>, M> = {
  [Name in keyof T]: ContractInstance<ReturnType<T[Name]['contract']>>;
};
