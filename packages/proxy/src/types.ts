import type { TestProvider } from './providers/test-provider';

export interface Contract<T> {
  address: string;
  contractFile: string;
  contract: (provider: TestProvider) => T;
}

export interface Contracts<T> {
  [key: string]: Contract<T>;
}

export type ContractInstances<T extends Contracts<M>, M> = {
  [Name in keyof T]: ReturnType<T[Name]['contract']>;
};
