import { proxy, TestProvider } from '@clarion/proxy';
import type { TestProjectContract } from './types';
import { TestProjectInterface } from './abi';

export const testProjectContract = (provider: TestProvider) => {
  const contract = proxy<TestProjectContract>(TestProjectInterface, provider);
  return contract;
};
