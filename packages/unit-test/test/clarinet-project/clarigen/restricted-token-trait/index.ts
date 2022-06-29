import { pureProxy, Contract } from '@clarigen/core';
import type { RestrictedTokenTraitContract } from './types';
import { RestrictedTokenTraitInterface } from './abi';
export type { RestrictedTokenTraitContract } from './types';

export function restrictedTokenTraitContract(contractAddress: string, contractName: string) {
  return pureProxy<RestrictedTokenTraitContract>({
    abi: RestrictedTokenTraitInterface,
    contractAddress,
    contractName,
  });
}

export const restrictedTokenTraitInfo: Contract<RestrictedTokenTraitContract> = {
  contract: restrictedTokenTraitContract,
  address: 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR',
  contractFile:
    'test/clarinet-project/.requirements/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.restricted-token-trait.clar',
  name: 'restricted-token-trait',
  abi: RestrictedTokenTraitInterface,
};
