import { proxy, BaseProvider, Contract } from '@clarigen/core';
import type { EchoContract } from './types';
import { EchoInterface } from './abi';
export type { EchoContract } from './types';

export const echoContract = (provider: BaseProvider) => {
  const contract = proxy<EchoContract>(EchoInterface, provider);
  return contract;
};

export const echoInfo: Contract<EchoContract> = {
  contract: echoContract,
  address: 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
  contractFile: 'test/clarinet-project/clarinet/contracts/echo.clar',
  name: 'echo',
};
