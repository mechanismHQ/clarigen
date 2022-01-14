import { pureProxy, Contract } from '@clarigen/core';
import type { EchoContract } from './types';
import { EchoInterface } from './abi';
export type { EchoContract } from './types';

export function echoContract(contractAddress: string, contractName: string) {
  return pureProxy<EchoContract>({
    abi: EchoInterface,
    contractAddress,
    contractName,
  });
}

export const echoInfo: Contract<EchoContract> = {
  contract: echoContract,
  address: 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
  contractFile: 'test/clarinet-project/clarinet/contracts/echo.clar',
  name: 'echo',
};
