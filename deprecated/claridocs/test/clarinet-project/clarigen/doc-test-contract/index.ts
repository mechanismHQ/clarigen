import { pureProxy, Contract } from '@clarigen/core';
import type { DocTestContractContract } from './types';
import { DocTestContractInterface } from './abi';
export type { DocTestContractContract } from './types';

export function docTestContractContract(contractAddress: string, contractName: string) {
  return pureProxy<DocTestContractContract>({
    abi: DocTestContractInterface,
    contractAddress,
    contractName,
  });
}

export const docTestContractInfo: Contract<DocTestContractContract> = {
  contract: docTestContractContract,
  address: 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
  contractFile: 'test/clarinet-project/contracts/doc-test-contract.clar',
  name: 'doc-test-contract',
  abi: DocTestContractInterface,
};
