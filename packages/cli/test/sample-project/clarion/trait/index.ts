import { proxy, BaseProvider, Contract } from '@clarion/core';
import type { TraitContract } from './types';
import { TraitInterface } from './abi';
export type { TraitContract } from './types';

export const traitContract = (provider: BaseProvider) => {
  const contract = proxy<TraitContract>(TraitInterface, provider);
  return contract;
};

export const traitInfo: Contract<TraitContract> = {
  contract: traitContract,
  address: 'ST50GEWRE7W5B02G3J3K19GNDDAPC3XPZPYQRQDW',
  contractFile: 'test/sample-project/contracts/trait.clar',
};
