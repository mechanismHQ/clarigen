import { proxy, TestProvider } from '@clarion/proxy';
import { SimpleContract } from './interface';
import { SimpleInterface } from './abi';

export const simpleContract = (provider: TestProvider) => {
  const contract = proxy<SimpleContract>(SimpleInterface, provider);
  return contract;
};
