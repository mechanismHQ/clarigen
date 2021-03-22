import { proxy, TestProvider, Contract } from '@clarion/proxy';
import type { SimpleContract } from './types';
import { SimpleInterface } from './abi';
export type { SimpleContract } from './types';

export const simpleContract = (provider: TestProvider) => {
  const contract = proxy<SimpleContract>(SimpleInterface, provider);
  return contract;
};

export const simple: Contract<SimpleContract> = {
  contract: simpleContract,
  address: 'ST3J2GVMMM2R07ZFBJDWTYEYAR8FZH5WKDTFJ9AHA',
  contractFile: 'test/contracts/simple/simple.clar',
};
