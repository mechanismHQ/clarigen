import { pureProxy, Contract } from '@clarigen/core';
import type { NestedContract } from './types';
import { NestedInterface } from './abi';
export type { NestedContract } from './types';

export function nestedContract(contractAddress: string, contractName: string) {
  return pureProxy<NestedContract>({
    abi: NestedInterface,
    contractAddress,
    contractName,
  });
}

export const nestedInfo: Contract<NestedContract> = {
  contract: nestedContract,
  address: 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
  contractFile: 'test/clarinet-project/clarinet/contracts/nested/nested.clar',
  name: 'nested',
};
