import { pureProxy, Contract } from '@clarigen/core';
import type { WrappedBitcoinContract } from './types';
import { WrappedBitcoinInterface } from './abi';
export type { WrappedBitcoinContract } from './types';

export function wrappedBitcoinContract(contractAddress: string, contractName: string) {
  return pureProxy<WrappedBitcoinContract>({
    abi: WrappedBitcoinInterface,
    contractAddress,
    contractName,
  });
}

export const wrappedBitcoinInfo: Contract<WrappedBitcoinContract> = {
  contract: wrappedBitcoinContract,
  address: 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR',
  contractFile:
    'test/clarinet-project/.requirements/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin.clar',
  name: 'Wrapped-Bitcoin',
  abi: WrappedBitcoinInterface,
};
