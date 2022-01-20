import { Contracts, ContractInstances } from './types';
import { getContractIdentifier } from './utils';

interface MakeContractsOptions {
  deployerAddress?: string;
}

export function makeContracts<T extends Contracts<M>, M>(
  contracts: T,
  options: MakeContractsOptions = {}
): ContractInstances<T, M> {
  const instances = {} as ContractInstances<T, M>;
  for (const k in contracts) {
    const contract = contracts[k];
    const address = options.deployerAddress || contract.address;
    const identifier = `${address}.${contract.name}`;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const instance = contract.contract(address, contract.name) as ReturnType<
      T[typeof k]['contract']
    >;
    instances[k] = {
      identifier,
      contract: instance,
    };
  }
  return instances;
}
