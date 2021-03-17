import { proxy, TestProvider } from '@clarion/proxy';
import type { SimpleContract } from './types';
import { SimpleInterface } from './abi';

export const simpleContract = (provider: TestProvider) => {
  const contract = proxy<SimpleContract>(SimpleInterface, provider);
  return contract;
};
