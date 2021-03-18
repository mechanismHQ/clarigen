import { proxy, TestProvider } from '@clarion/proxy';
import type { TraitContract } from './types';
import { TraitInterface } from './abi';

export const traitContract = (provider: TestProvider) => {
  const contract = proxy<TraitContract>(TraitInterface, provider);
  return contract;
};
