import { pureProxy, Contract } from '@clarigen/core';
import type { SimpleContract } from './types';
import { SimpleInterface } from './abi';
export type { SimpleContract } from './types';

export function simpleContract(contractAddress: string, contractName: string) {
  return pureProxy<SimpleContract>({
    abi: SimpleInterface,
    contractAddress,
    contractName,
  });
}

export const simpleInfo: Contract<SimpleContract> = {
  contract: simpleContract,
  address: 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
  contractFile: 'test/contracts/simple/simple.clar',
  name: 'simple',
};
