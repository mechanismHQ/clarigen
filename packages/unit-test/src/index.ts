import {
  NativeClarityBinProvider,
  deployContract,
  ClarinetAccounts,
  createClarityBin,
} from '@clarigen/native-bin';
import {
  ContractInstances,
  Contracts,
  getContractIdentifier,
  ContractCall,
  ContractCalls,
  Response,
  expectOk,
  expectErr,
} from '@clarigen/core';
import { deployUtilContract, UTIL_CONTRACT_ID } from './utils';
import {
  evalCode,
  mapGet,
  PublicResultErr,
  PublicResultOk,
  ReadOnlyResult,
  ro,
  tx as _tx,
} from './utils/pure';
import { resolve } from 'path';
export type { PublicResultErr, PublicResultOk, ReadOnlyResult } from './utils/pure';
export {
  getBlockHeight,
  mineBlocks,
  getStxBalance,
  makeRandomAddress,
  setupCoverage,
  finishCoverage,
} from './utils';
export { Allocation, createClarityBin, executeJson, evalJson } from '@clarigen/native-bin';

interface FromContractsOptions {
  accounts?: ClarinetAccounts;
  clarityBin?: NativeClarityBinProvider;
  coverageFolder?: string;
}

interface FromContracts<T extends Contracts<any>> {
  deployed: ContractInstances<T>;
  provider: TestProvider;
}

export class TestProvider {
  public clarityBin: NativeClarityBinProvider;
  public coverageFolder?: string;

  constructor(clarityBin: NativeClarityBinProvider) {
    this.clarityBin = clarityBin;
  }

  public static async fromContracts<T extends Contracts<any>>(
    contracts: T,
    options: FromContractsOptions = {}
  ): Promise<FromContracts<T>> {
    const clarityBin =
      options.clarityBin ||
      (await createClarityBin({
        allocations: options.accounts,
      }));
    const instances = {} as ContractInstances<T>;
    let coverageFolder = options.coverageFolder;
    if (process.env.CLARIGEN_COVERAGE) {
      coverageFolder = resolve(process.cwd(), 'coverage');
    }
    await deployUtilContract(clarityBin);
    for (const k in contracts) {
      if (Object.prototype.hasOwnProperty.call(contracts, k)) {
        const contract = contracts[k];
        const identifier = getContractIdentifier(contract);
        await deployContract({
          contractIdentifier: identifier,
          contractFilePath: contract.contractFile,
          provider: clarityBin,
          coverageFolder,
        });
        const instance = contract.contract(contract.address, contract.name);
        instances[k] = {
          identifier: getContractIdentifier(contract),
          contract: instance as ReturnType<T[typeof k]['contract']>,
        };
      }
    }
    const provider = new this(clarityBin);
    provider.coverageFolder = coverageFolder;
    return {
      deployed: instances,
      provider,
    };
  }

  public ro<T>(tx: ContractCall<T>): Promise<ReadOnlyResult<T>> {
    return ro({ tx, bin: this.clarityBin, coverageFolder: this.coverageFolder });
  }

  public async rov<T>(tx: ContractCall<T>): Promise<T> {
    const result = await this.ro(tx);
    return result.value;
  }

  public async roOk<Ok, Err>(tx: ContractCall<Response<Ok, Err>>): Promise<ReadOnlyResult<Ok>> {
    const result = await this.ro(tx);
    const value = expectOk(result.value);
    return {
      ...result,
      value,
    };
  }

  public async roErr<Ok, Err>(tx: ContractCall<Response<Ok, Err>>): Promise<ReadOnlyResult<Err>> {
    const result = await this.ro(tx);
    const value = expectErr(result.value);
    return {
      ...result,
      value,
    };
  }

  public async rovOk<Ok, Err>(tx: ContractCall<Response<Ok, Err>>): Promise<Ok> {
    return (await this.roOk(tx)).value;
  }

  public async rovErr<Ok, Err>(tx: ContractCall<Response<Ok, Err>>): Promise<Err> {
    return (await this.roErr(tx)).value;
  }

  public tx<Ok, Err>(tx: ContractCalls.Public<Ok, Err>, senderAddress: string) {
    return _tx({
      tx,
      senderAddress,
      bin: this.clarityBin,
      coverageFolder: this.coverageFolder,
    });
  }

  public async txOk<Ok, Err>(
    tx: ContractCalls.Public<Ok, Err>,
    senderAddress: string
  ): Promise<PublicResultOk<Ok>> {
    const result = await this.tx(tx, senderAddress);
    if (!result.isOk) throw new Error(`Expected OK, received error: ${result.value}`);
    return result;
  }

  public async txErr<Ok, Err>(
    tx: ContractCalls.Public<Ok, Err>,
    senderAddress: string
  ): Promise<PublicResultErr<Err>> {
    const result = await this.tx(tx, senderAddress);
    if (result.isOk) throw new Error(`Expected Err, received ok: ${result.value}`);
    return result;
  }

  public evalCode<T>(code: string, contractAddress = UTIL_CONTRACT_ID): Promise<ReadOnlyResult<T>> {
    return evalCode({
      contractAddress,
      code,
      bin: this.clarityBin,
      coverageFolder: this.coverageFolder,
    });
  }

  public async eval<T>(code: string, contractAddress = UTIL_CONTRACT_ID): Promise<T> {
    const result = await this.evalCode<T>(code, contractAddress);
    return result.value;
  }

  public mapGet<T extends ContractCalls.Map<any, Val>, Val>(map: T): Promise<Val | null> {
    return mapGet({ map, bin: this.clarityBin });
  }
}
