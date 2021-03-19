import { Client, NativeClarityBinProvider } from '@blockstack/clarity';
import {
  ClarityValue,
  cvToString,
  deserializeCV,
  parseToCV,
  responseErrorCV,
  responseOkCV,
} from '@stacks/transactions';
import { ClarityAbiFunction } from '@stacks/transactions/dist/transactions/src/contract-abi';
import { Submitter, Transaction, TransactionResult } from '../../transaction';
import { evalJson, executeJson, Allocation } from './utils';
export { Allocation, createClarityBin } from './utils';

interface CreateOptions {
  allocations?: Allocation[];
  contractIdentifier: string;
  contractFilePath: string;
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

  async callReadOnly(func: ClarityAbiFunction, args: any[]): Promise<ClarityValue> {
    const argsFormatted = this.formatArguments(func, args);
    const result = await evalJson({
      contractAddress: this.client.name,
      functionName: func.name,
      args: argsFormatted,
      provider: this.clarityBin,
    });
    const resultCV = deserializeCV(Buffer.from(result.result_raw, 'hex'));
    return resultCV;
  }

  callPublic(func: ClarityAbiFunction, args: any[]): Transaction<ClarityValue, ClarityValue> {
    const argsFormatted = this.formatArguments(func, args);
    const submit: Submitter<ClarityValue, ClarityValue> = async options => {
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
      const getResult = (): Promise<TransactionResult<ClarityValue, ClarityValue>> => {
        const resultCV = deserializeCV(Buffer.from(receipt.result_raw, 'hex'));
        if (receipt.success) {
          return Promise.resolve({
            isOk: true,
            response: responseOkCV(resultCV),
            value: resultCV,
          });
        } else {
          return Promise.resolve({
            isOk: false,
            response: responseErrorCV(resultCV),
            value: resultCV,
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
      const argCV = parseToCV(arg, type);
      const cvString = cvToString(argCV);
      if (type === 'principal') {
        return `'${cvString}`;
      }
      return cvString;
    });
  }
}
