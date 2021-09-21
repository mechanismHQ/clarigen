import { Configuration, SmartContractsApi } from '@stacks/blockchain-api-client';
import { ClarityType, deserializeCV, serializeCV } from 'micro-stacks/clarity';
import { ClarityAbiFunction, makeContractCallToken, openTransactionPopup, AuthOptions } from 'micro-stacks/connect';
import { StacksNetwork } from 'micro-stacks/network';
import { bytesToHex, hexToBytes } from 'micro-stacks/common';

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

export interface WebConfig {
  stxAddress: string;
  privateKey: string;
  network: StacksNetwork;
  appDetails: AuthOptions['appDetails'];
}

export class WebProvider implements BaseProvider {
  apiClient: SmartContractsApi;
  identifier: string;
  stxAddress: string;
  privateKey: string;
  network: StacksNetwork;
  appDetails: AuthOptions['appDetails'];

  constructor({
    network,
    identifier,
    stxAddress,
    privateKey,
    appDetails,
  }: WebConfig & { identifier: string }) {
    const apiConfig = new Configuration({
      fetchApi: window.fetch.bind(window),
      basePath: network.coreApiUrl,
    });

    const apiClient = new SmartContractsApi(apiConfig);
    this.apiClient = apiClient;
    this.identifier = identifier;
    this.privateKey = privateKey;
    this.stxAddress = stxAddress;
    this.network = network;
    this.appDetails = appDetails;
  }

  static fromContracts<T extends Contracts<M>, M>(
    contracts: T,
    config: WebConfig
  ): ContractInstances<T, M> {
    const instances = {} as ContractInstances<T, M>;
    for (const k in contracts) {
      const contract = contracts[k];
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
    const argumentsFormatted = args.map((arg, index) => {
      const { type } = func.args[index];
      const valueCV = parseToCV(arg, type);
      return bytesToHex(serializeCV(valueCV));
    });
    const [contractAddress, contractName] = this.identifier.split('.');
    const response = await this.apiClient.callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: func.name,
      readOnlyFunctionArgs: {
        sender: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
        arguments: argumentsFormatted,
      },
    });
    if (!response.okay || !response.result) {
      console.log(response);
      throw new Error('Error calling read-only function');
    }
    const resultCV = deserializeCV(hexToBytes(response.result.replace(/^0x/, '')));
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

  async callPublic(func: ClarityAbiFunction, args: any[]): Transaction<any, any> {
    const argumentsFormatted = args.map((arg, index) => {
      const { type } = func.args[index];
      const valueCV = parseToCV(arg, type);
      return bytesToHex(serializeCV(valueCV));
    });
    const [contractAddress, contractName] = this.identifier.split('.');
    const token = await makeContractCallToken({
      contractAddress,
      contractName,
      functionName: func.name,
      functionArgs: argumentsFormatted,
      network: this.network,
      stxAddress: this.stxAddress,
      privateKey: this.privateKey,
      appDetails: this.appDetails,
    });
    return openTransactionPopup({ token });
  }
}
