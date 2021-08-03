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
import { SmartContractsApi, Configuration, AccountsApi } from '@stacks/blockchain-api-client';
import { StacksNetwork } from '@stacks/network';
import { ClarityAbiFunction, ClarityType, deserializeCV, serializeCV } from '@stacks/transactions';
import fetch from 'cross-fetch';
import { makeTx } from './utils';
export { NodeTransaction } from './utils';

export interface NodeConfig {
  privateKey: string;
  network: StacksNetwork;
  deployerAddress?: string;
}

export class NodeProvider implements BaseProvider {
  apiClient: SmartContractsApi;
  identifier: string;
  privateKey: string;
  network: StacksNetwork;

  constructor({ network, identifier, privateKey }: NodeConfig & { identifier: string }) {
    const apiConfig = new Configuration({
      fetchApi: fetch,
      basePath: network.coreApiUrl,
    });

    const apiClient = new SmartContractsApi(apiConfig);
    this.apiClient = apiClient;
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
    const argumentsFormatted = args.map((arg, index) => {
      const { type } = func.args[index];
      const valueCV = parseToCV(arg, type);
      return serializeCV(valueCV).toString('hex');
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
    const resultCV = deserializeCV(Buffer.from(response.result.replace(/^0x/, ''), 'hex'));
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
