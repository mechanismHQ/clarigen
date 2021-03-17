import { proxy as clarionProxy, TestProvider } from '@clarion/proxy';
import { SimpleContract } from './interface';
import { SimpleInterface } from './abi';

export const proxy = (provider: TestProvider) => {
  const contract = clarionProxy<SimpleContract>(SimpleInterface, provider);
  return contract;
};
