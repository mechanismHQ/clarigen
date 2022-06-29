import { pureProxy, Contract } from '@clarigen/core';
import type { FtTraitContract } from './types';
import { FtTraitInterface } from './abi';
export type { FtTraitContract } from './types';

export function ftTraitContract(contractAddress: string, contractName: string) {
  return pureProxy<FtTraitContract>({
    abi: FtTraitInterface,
    contractAddress,
    contractName,
  });
}

export const ftTraitInfo: Contract<FtTraitContract> = {
  contract: ftTraitContract,
  address: 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR',
  contractFile:
    'test/clarinet-project/.requirements/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.ft-trait.clar',
  name: 'ft-trait',
  abi: FtTraitInterface,
};
