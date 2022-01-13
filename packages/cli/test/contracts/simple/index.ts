import { proxy, BaseProvider, Contract } from '@clarigen/core';
import type { SimpleContract } from './types';
import { SimpleInterface } from './abi';
export type { SimpleContract } from './types';

export const simpleContract = (provider: BaseProvider) => {
  const contract = proxy<SimpleContract>(SimpleInterface, provider);
  return contract;
};

export const simpleInfo: Contract<SimpleContract> = {
  contract: simpleContract,
  address: 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
  contractFile: 'test/contracts/simple/simple.clar',
  name: 'simple',
};
