import { ClarityAbi } from './clarity-types';

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

export type ContractInstances<T extends Contracts<M>, M> = {
  [Name in keyof T]: ContractInstance<ReturnType<T[Name]['contract']>>;
};
