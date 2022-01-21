import { ClarityAbiFunction, ClarityType } from 'micro-stacks/clarity';
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
import { AppDetails, makeTx } from './utils';
import { StacksNetwork } from 'micro-stacks/network';
import { callReadOnlyFunction } from 'micro-stacks/api';

export interface WebConfig {
  stxAddress: string;
  privateKey: string;
  network: StacksNetwork;
  appDetails: AppDetails;
  deployerAddress?: string;
}

export class WebProvider implements BaseProvider {
  identifier: string;
  stxAddress: string;
  privateKey: string;
  network: StacksNetwork;
  appDetails: AppDetails;

  constructor({
    network,
    identifier,
    stxAddress,
    privateKey,
    appDetails,
  }: WebConfig & { identifier: string }) {
    this.identifier = identifier;
    this.privateKey = privateKey;
    this.stxAddress = stxAddress;
    this.network = network;
    this.appDetails = appDetails;
  }

  static fromContracts<T extends Contracts<any>>(
    contracts: T,
    config: WebConfig
  ): ContractInstances<T> {
    const instances = {} as ContractInstances<T>;
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
    const argumentsFormatted = args.map((arg, index) => parseToCV(arg, func.args[index].type));
    const [contractAddress, contractName] = this.identifier.split('.');
    return makeTx({
      contractAddress,
      contractName,
      functionName: func.name,
      functionArgs: argumentsFormatted,
      network: this.network,
      stxAddress: this.stxAddress,
      privateKey: this.privateKey,
      appDetails: this.appDetails,
    });
  }
}
