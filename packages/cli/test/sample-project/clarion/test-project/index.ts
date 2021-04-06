import { proxy, BaseProvider, Contract } from '@clarion/core';
import type { TestProjectContract } from './types';
import { TestProjectInterface } from './abi';
export type { TestProjectContract } from './types';

export const testProjectContract = (provider: BaseProvider) => {
  const contract = proxy<TestProjectContract>(TestProjectInterface, provider);
  return contract;
};

export const testProjectInfo: Contract<TestProjectContract> = {
  contract: testProjectContract,
  address: 'S1G2081040G2081040G2081040G208105NK8PE5',
  contractFile: 'test/sample-project/contracts/test-project.clar',
};
