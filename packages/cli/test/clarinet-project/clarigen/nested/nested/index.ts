import { proxy, BaseProvider, Contract } from '@clarigen/core';
import type { NestedContract } from './types';
import { NestedInterface } from './abi';
export type { NestedContract } from './types';

export const nestedContract = (provider: BaseProvider) => {
  const contract = proxy<NestedContract>(NestedInterface, provider);
  return contract;
};

export const nestedInfo: Contract<NestedContract> = {
  contract: nestedContract,
  address: 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
  contractFile: 'test/clarinet-project/clarinet/contracts/nested/nested.clar',
};
