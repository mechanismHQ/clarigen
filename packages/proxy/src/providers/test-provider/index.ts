import { Client, Provider, NativeClarityBinProvider } from '@blockstack/clarity';
import { getTempFilePath } from '@blockstack/clarity/lib/utils/fsUtil';
import { getDefaultBinaryFilePath } from '@blockstack/clarity-native-bin';
import { ClarityValue, cvToString, parseToCV } from '@stacks/transactions';
import { ClarityAbiFunction } from '@stacks/transactions/dist/transactions/src/contract-abi';
import { Submitter, Transaction } from '../../transaction';
import { receiptToCV } from './utils';

interface Allocation {
  principal: string;
  amount: number;
}

interface CreateOptions {
  allocations?: Allocation[];
  contractIdentifier: string;
  contractFilePath: string;
}

export class TestProvider {
  provider: Provider;
  client: Client;

  constructor(provider: Provider, client: Client) {
    this.provider = provider;
    this.client = client;
  }

  static async create(opts: CreateOptions) {
    const { allocations } = opts;
    const binFile = getDefaultBinaryFilePath();
    const dbFileName = getTempFilePath();
    const provider = await NativeClarityBinProvider.create(allocations || [], dbFileName, binFile);
    const client = new Client(opts.contractIdentifier, opts.contractFilePath, provider);
    await client.deployContract();
    return new this(provider, client);
  }

  async callReadOnly(func: ClarityAbiFunction, args: any[]): Promise<ClarityValue> {
    const argsFormatted = this.formatArguments(func, args);
    const query = this.client.createQuery({
      atChaintip: true,
      method: { name: func.name, args: argsFormatted },
    });
    const receipt = await this.client.submitQuery(query);
    const cv = receiptToCV(receipt, func);
    console.log(cv);
    // console.log(res);
    return cv;
  }

  callPublic(func: ClarityAbiFunction, args: any[]): Transaction {
    const argsFormatted = this.formatArguments(func, args);
    const tx = this.client.createTransaction({
      method: { name: func.name, args: argsFormatted },
    });
    const submit: Submitter = async options => {
      if (!options?.sender) {
        throw new Error('Passing `sender` is required.');
      }
      await tx.sign(options.sender);
      const receipt = await this.client.submitTransaction(tx);
      const getResult = () => {
        const cv = receiptToCV(receipt, func);
        return Promise.resolve({ value: cv });
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
