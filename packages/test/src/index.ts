import { NativeClarityBinProvider } from '@clarigen/native-bin';
import {
  ClarityType,
  deserializeCV,
  responseErrorCV,
  responseOkCV,
  ClarityAbiFunction,
} from '@stacks/transactions';
import { ok, err } from 'neverthrow';
import {
  Submitter,
  Transaction,
  TransactionResult,
  Contract,
  ContractInstances,
  Contracts,
  getContractNameFromPath,
  getContractIdentifier,
  BaseProvider,
  parseToCV,
  cvToValue,
  cvToString,
} from '@clarigen/core';
import {
  evalJson,
  executeJson,
  Allocation,
  deployContract,
  deployUtilContract,
  ClarinetAccounts,
  getDefaultClarityBin,
} from './utils';
export {
  Allocation,
  createClarityBin,
  tx,
  txOk,
  txErr,
  getBlockHeight,
  mineBlocks,
  getStxBalance,
  executeJson,
  evalJson,
} from './utils';

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

interface UtilsContract {
  getBlockHeight: Promise<number>;
}

export class TestProvider implements BaseProvider {
  clarityBin: NativeClarityBinProvider;
  contractIdentifier: string;
  contractFile: string;

  constructor(
    clarityBin: NativeClarityBinProvider,
    contractIdentifier: string,
    contractFile: string
  ) {
    this.clarityBin = clarityBin;
    this.contractIdentifier = contractIdentifier;
    this.contractFile = contractFile;
  }

  static async create({ clarityBin, contractFilePath, contractIdentifier }: CreateOptions) {
    await deployContract({ contractIdentifier, contractFilePath, provider: clarityBin });
    return new this(clarityBin, contractIdentifier, contractFilePath);
  }

  static async fromContract<T>({ contract, clarityBin }: FromContractOptions<T>) {
    const { address } = contract;
    if (!address) {
      throw new Error('TestProvider must have an address');
    }
    const contractName = contract.name || getContractNameFromPath(contract.contractFile);

    const provider = await this.create({
      clarityBin,
      contractFilePath: contract.contractFile,
      contractIdentifier: `${address}.${contractName}`,
    });
    return contract.contract(provider);
  }

  public static async fromContracts<T extends Contracts<M>, M>(
    contracts: T,
    clarityBin?: NativeClarityBinProvider
  ): Promise<ContractInstances<T, M>>;
  public static async fromContracts<T extends Contracts<M>, M>(
    contracts: T,
    accounts?: ClarinetAccounts
  ): Promise<ContractInstances<T, M>>;
  public static async fromContracts<T extends Contracts<M>, M>(
    contracts: T,
    clarityBinOrAccounts?: NativeClarityBinProvider | ClarinetAccounts
  ): Promise<ContractInstances<T, M>> {
    const clarityBin = await getDefaultClarityBin(clarityBinOrAccounts);
    const instances = {} as ContractInstances<T, M>;
    await deployUtilContract(clarityBin);
    for (const k in contracts) {
      const contract = contracts[k];
      const instance = await this.fromContract({
        contract,
        clarityBin,
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
      contractAddress: this.contractIdentifier,
      functionName: func.name,
      args: argsFormatted,
      provider: this.clarityBin,
    });
    const resultCV = deserializeCV(Buffer.from(result.output_serialized, 'hex'));
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
      if (!('sender' in options)) {
        throw new Error('Passing `sender` is required.');
      }
      const receipt = await executeJson({
        provider: this.clarityBin,
        contractAddress: this.contractIdentifier,
        senderAddress: options.sender,
        functionName: func.name,
        args: argsFormatted,
      });
      const getResult = (): Promise<TransactionResult<any, any>> => {
        const resultCV = deserializeCV(Buffer.from(receipt.output_serialized, 'hex'));
        const result = cvToValue(resultCV);
        if (receipt.success) {
          return Promise.resolve({
            isOk: true,
            response: responseOkCV(resultCV),
            value: result,
            events: receipt.events,
            costs: receipt.costs,
            assets: receipt.assets,
          });
        } else {
          return Promise.resolve({
            isOk: false,
            response: responseErrorCV(resultCV),
            value: result,
            costs: receipt.costs,
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
      return cvString;
    });
  }
}
