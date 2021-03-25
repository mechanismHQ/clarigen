import { Client, NativeClarityBinProvider } from '@blockstack/clarity';
import {
  ClarityType,
  cvToString,
  deserializeCV,
  parseToCV,
  responseErrorCV,
  responseOkCV,
} from '@stacks/transactions';
import type { ClarityAbiFunction } from '@stacks/transactions/dist/transactions/src/contract-abi';
import { ok, err } from 'neverthrow';
import { Submitter, Transaction, TransactionResult } from '../../transaction';
import { evalJson, executeJson, Allocation, createClarityBin, cvToValue } from './utils';
export { Allocation, createClarityBin, cvToValue } from './utils';
import { Contract, ContractInstances, Contracts } from '../../types';
import { getContractNameFromPath, getContractIdentifier } from '../../utils';

interface CreateOptions {
  allocations?: Allocation[];
  contractIdentifier: string;
  contractFilePath: string;
  clarityBin: NativeClarityBinProvider;
}

interface FromContractOptions<T> {
  contract: Contract<T>;
  clarityBin: NativeClarityBinProvider;
}

export class TestProvider {
  clarityBin: NativeClarityBinProvider;
  client: Client;

  constructor(clarityBin: NativeClarityBinProvider, client: Client) {
    this.clarityBin = clarityBin;
    this.client = client;
  }

  static async create({ clarityBin, contractFilePath, contractIdentifier }: CreateOptions) {
    const client = new Client(contractIdentifier, contractFilePath, clarityBin);
    await client.deployContract();
    return new this(clarityBin, client);
  }

  static async fromContract<T>({ contract, clarityBin }: FromContractOptions<T>) {
    const { address } = contract;
    if (!address) {
      throw new Error('TestProvider must have an address');
    }
    const contractName = getContractNameFromPath(contract.contractFile);

    const provider = await this.create({
      clarityBin,
      contractFilePath: contract.contractFile,
      contractIdentifier: `${address}.${contractName}`,
    });
    return contract.contract(provider);
  }

  static async fromContracts<T extends Contracts<M>, M>(
    contracts: T,
    clarityBin?: NativeClarityBinProvider
  ): Promise<ContractInstances<T, M>> {
    const _clarityBin = clarityBin ?? (await createClarityBin());
    const instances = {} as ContractInstances<T, M>;
    for (const k in contracts) {
      const contract = contracts[k];
      const instance = await this.fromContract({
        contract,
        clarityBin: _clarityBin,
      });
      instances[k] = {
        identifier: getContractIdentifier(contract),
        contract: instance as ReturnType<T[typeof k]['contract']>,
      };
    }
    return instances;
  }

  async callReadOnly(func: ClarityAbiFunction, args: any[]) {
    const argsFormatted = this.formatArguments(func, args);
    const result = await evalJson({
      contractAddress: this.client.name,
      functionName: func.name,
      args: argsFormatted,
      provider: this.clarityBin,
    });
    const resultCV = deserializeCV(Buffer.from(result.result_raw, 'hex'));
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
    const argsFormatted = this.formatArguments(func, args);
    const submit: Submitter<any, any> = async options => {
      if (!options?.sender) {
        throw new Error('Passing `sender` is required.');
      }
      const receipt = await executeJson({
        provider: this.clarityBin,
        contractAddress: this.client.name,
        senderAddress: options.sender,
        functionName: func.name,
        args: argsFormatted,
      });
      const getResult = (): Promise<TransactionResult<any, any>> => {
        const resultCV = deserializeCV(Buffer.from(receipt.result_raw, 'hex'));
        const result = cvToValue(resultCV);
        if (receipt.success) {
          return Promise.resolve({
            isOk: true,
            response: responseOkCV(resultCV),
            value: result,
            events: receipt.events,
          });
        } else {
          return Promise.resolve({
            isOk: false,
            response: responseErrorCV(resultCV),
            value: result,
          });
        }
      };
      return {
        getResult,
      };
    };
    return {
      submit,
    };
  }

  formatArguments(func: ClarityAbiFunction, args: any[]): string[] {
    return args.map((arg, index) => {
      const { type } = func.args[index];
      if (type === 'trait_reference') {
        return `'${arg}`;
      }
      const argCV = parseToCV(arg, type);
      const cvString = cvToString(argCV);
      if (type === 'principal') {
        return `'${cvString}`;
      }
      return cvString;
    });
  }
}
