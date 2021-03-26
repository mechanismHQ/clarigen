import { Configuration, SmartContractsApi } from '@stacks/blockchain-api-client';
import {
  ClarityAbiFunction,
  ClarityType,
  deserializeCV,
  parseToCV,
  serializeCV,
} from '@stacks/transactions';
import { ok, err } from 'neverthrow';
import {
  BaseProvider,
  Transaction,
  getContractIdentifier,
  Contracts,
  ContractInstances,
  cvToValue,
} from '@clarion/core';

const apiConfig = new Configuration({
  fetchApi: window.fetch.bind(window),
  basePath: 'https://stacks-node-api.mainnet.stacks.co',
});

const apiClient = new SmartContractsApi(apiConfig);

export class WebProvider implements BaseProvider {
  apiClient: SmartContractsApi;
  identifier: string;

  constructor({ nodeUrl, identifier }: { nodeUrl: string; identifier: string }) {
    const apiConfig = new Configuration({
      fetchApi: fetch,
      basePath: nodeUrl,
    });

    const apiClient = new SmartContractsApi(apiConfig);
    this.apiClient = apiClient;
    this.identifier = identifier;
  }

  static fromContracts<T extends Contracts<M>, M>(
    contracts: T,
    nodeUrl: string
  ): ContractInstances<T, M> {
    const instances = {} as ContractInstances<T, M>;
    for (const k in contracts) {
      const contract = contracts[k];
      const identifier = getContractIdentifier(contract);
      const provider = new this({ nodeUrl, identifier });
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
    const response = await apiClient.callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: func.name,
      readOnlyFunctionArgs: {
        sender: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
        arguments: argumentsFormatted,
      },
    });
    if (response.okay || !response.result) {
      throw new Error('Error calling read-only function');
    }
    const resultCV = deserializeCV(Buffer.from(response.result, 'hex'));
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
    throw new Error('Not implemented');
  }
}
