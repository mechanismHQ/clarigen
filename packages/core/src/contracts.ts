import { Contracts, ContractInstances } from './types';
import { getContractIdentifier } from './utils';

interface MakeContractsOptions {
  deployerAddress?: string;
}

export function makeContracts<T extends Contracts<any>>(
  contracts: T,
  options: MakeContractsOptions = {}
): ContractInstances<T> {
  const instances = {} as ContractInstances<T>;
  for (const k in contracts) {
    const contract = contracts[k];
    const address = options.deployerAddress || contract.address;
    const identifier = `${address}.${contract.name}`;
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
