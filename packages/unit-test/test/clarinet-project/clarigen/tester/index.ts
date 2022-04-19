import { pureProxy, Contract } from '@clarigen/core';
import type { TesterContract } from './types';
import { TesterInterface } from './abi';
export type { TesterContract } from './types';

export function testerContract(contractAddress: string, contractName: string) {
  return pureProxy<TesterContract>({
    abi: TesterInterface,
    contractAddress,
    contractName,
  });
}

export const testerInfo: Contract<TesterContract> = {
  contract: testerContract,
  address: 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
  contractFile: 'test/clarinet-project/contracts/tester.clar',
  name: 'tester',
  abi: TesterInterface,
};
