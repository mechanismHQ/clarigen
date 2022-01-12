import { ok, err } from 'neverthrow';
import {
  BaseProvider,
  Transaction,
  getContractIdentifier,
  Contracts,
  ContractInstances,
  cvToValue,
  parseToCV,
} from '@clarigen/core';
import { StacksNetwork } from 'micro-stacks/network';
import { ClarityAbiFunction, ClarityType } from 'micro-stacks/clarity';
import { makeTx } from './utils';
import { callReadOnlyFunction } from 'micro-stacks/api';
export { NodeTransaction, tx } from './utils';

export interface NodeConfig {
  privateKey: string;
  network: StacksNetwork;
  deployerAddress?: string;
}

export class NodeProvider implements BaseProvider {
  identifier: string;
  privateKey: string;
  network: StacksNetwork;

  constructor({ network, identifier, privateKey }: NodeConfig & { identifier: string }) {
    this.identifier = identifier;
    this.privateKey = privateKey;
    this.network = network;
  }

  static fromContracts<T extends Contracts<M>, M>(
    contracts: T,
    config: NodeConfig
  ): ContractInstances<T, M> {
    const instances = {} as ContractInstances<T, M>;
    for (const k in contracts) {
      const contract = contracts[k];
      contract.address = config.deployerAddress || contract.address;
      const identifier = getContractIdentifier(contract);
      const provider = new this({ ...config, identifier });
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const instance = contract.contract(provider) as ReturnType<T[typeof k]['contract']>;
      instances[k] = {
        identifier,
        contract: instance,
      };
    }
    return instances;
  }

  async callReadOnly(func: ClarityAbiFunction, args: any[]) {
    const argumentsFormatted = args.map((arg, index) => parseToCV(arg, func.args[index].type));
    const [contractAddress, contractName] = this.identifier.split('.');
    const resultCV = await callReadOnlyFunction({
      contractAddress,
      contractName,
      functionArgs: argumentsFormatted,
      functionName: func.name,
      network: this.network,
    });
    const value = cvToValue(resultCV);
    switch (resultCV.type) {
      case ClarityType.ResponseOk:
        return ok(value);
      case ClarityType.ResponseErr:
        return err(value);
      default:
        return value;
    }
  }

  callPublic(func: ClarityAbiFunction, args: any[]): Transaction<any, any> {
    const argumentsFormatted = args.map((arg, index) => {
      const { type } = func.args[index];
      const valueCV = parseToCV(arg, type);
      return valueCV;
    });
    const [contractAddress, contractName] = this.identifier.split('.');
    return makeTx({
      contractAddress,
      contractName,
      functionName: func.name,
      functionArgs: argumentsFormatted,
      network: this.network,
      privateKey: this.privateKey,
    });
  }
}
