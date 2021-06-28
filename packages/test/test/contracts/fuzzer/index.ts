import { proxy, BaseProvider, Contract } from '@clarigen/core';
import type { FuzzerContract } from './types';
import { FuzzerInterface } from './abi';
export type { FuzzerContract } from './types';

export const fuzzerContract = (provider: BaseProvider) => {
  const contract = proxy<FuzzerContract>(FuzzerInterface, provider);
  return contract;
};

export const fuzzerInfo: Contract<FuzzerContract> = {
  contract: fuzzerContract,
  address: 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
  contractFile: 'test/clarinet-project/clarinet/contracts/fuzzer.clar',
};
