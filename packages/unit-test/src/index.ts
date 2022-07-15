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
  AllContracts,
  ContractFactory,
  ResponseErr,
  ResponseOk,
  Project,
  DeploymentsForContracts,
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
import { Simnet } from './utils/test-factory';
export type { PublicResultErr, PublicResultOk, ReadOnlyResult } from './utils/pure';
export {
  getBlockHeight,
  mineBlocks,
  getStxBalance,
  makeRandomAddress,
  setupCoverage,
  finishCoverage,
} from './utils';
export * from './utils/test-factory';
export { Allocation, createClarityBin, executeJson, evalJson } from '@clarigen/native-bin';

interface FromContractsOptions {
  accounts?: ClarinetAccounts;
  clarityBin?: NativeClarityBinProvider;
  coverageFolder?: string;
  clarinetPath?: string;
}

interface FromContracts<T extends Contracts<any>> {
  deployed: ContractInstances<T>;
  provider: TestProvider;
}

type OkType<T> = T extends ResponseOk<infer Ok, unknown> ? Ok : never;
type ErrType<T> = T extends ResponseErr<unknown, infer Err> ? Err : never;

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

  public static async fromProject(simnet: Simnet, options: FromContractsOptions = {}) {
    const allocations = Object.fromEntries(
      Object.entries(simnet.accounts).map(([name, account]) => {
        return [name, { ...account, balance: BigInt(account.balance) }];
      })
    ) as ClarinetAccounts;
    const clarityBin =
      options.clarityBin ||
      (await createClarityBin({
        allocations,
      }));
    let coverageFolder = options.coverageFolder;
    if (process.env.CLARIGEN_COVERAGE) {
      coverageFolder = resolve(process.cwd(), 'coverage');
    }
    await deployUtilContract(clarityBin);
    for (const contract of simnet.deployment) {
      let contractFilePath = contract.file;
      if (options.clarinetPath) {
        contractFilePath = resolve(process.cwd(), options.clarinetPath, contractFilePath);
      }
      await deployContract({
        contractIdentifier: contract.identifier,
        contractFilePath,
        provider: clarityBin,
        coverageFolder,
      });
    }
    const provider = new this(clarityBin);
    provider.coverageFolder = coverageFolder;
    return provider;
  }

  public static async fromFactory(
    contracts: ContractFactory<AllContracts>,
    options: FromContractsOptions = {}
  ) {
    const clarityBin =
      options.clarityBin ||
      (await createClarityBin({
        allocations: options.accounts,
      }));
    let coverageFolder = options.coverageFolder;
    if (process.env.CLARIGEN_COVERAGE) {
      coverageFolder = resolve(process.cwd(), 'coverage');
    }
    await deployUtilContract(clarityBin);
    for (const k in contracts) {
      if (Object.prototype.hasOwnProperty.call(contracts, k)) {
        const contract = contracts[k];
        let contractFilePath = contract.contractFile;
        if (options.clarinetPath) {
          contractFilePath = resolve(process.cwd(), options.clarinetPath, contractFilePath);
        }
        if (typeof contractFilePath === 'undefined') {
          throw new Error('Cannot setup @clarigen/test - missing contract file.');
        }
        await deployContract({
          contractIdentifier: contract.identifier,
          contractFilePath,
          provider: clarityBin,
          coverageFolder,
        });
      }
    }
    const provider = new this(clarityBin);
    provider.coverageFolder = coverageFolder;
    return provider;
  }

  public ro<T>(tx: ContractCall<T>): Promise<ReadOnlyResult<T>> {
    return ro({ tx, bin: this.clarityBin, coverageFolder: this.coverageFolder });
  }

  public async rov<T>(tx: ContractCall<T>): Promise<T> {
    const result = await this.ro(tx);
    return result.value;
  }

  public async roOk<R extends Response<unknown, unknown>>(
    tx: ContractCall<R>
  ): Promise<ReadOnlyResult<OkType<R>>> {
    const result = await this.ro(tx);
    const value = expectOk(result.value);
    return {
      ...result,
      value: value as OkType<R>,
    };
  }

  public async roErr<R extends Response<unknown, unknown>>(
    tx: ContractCall<R>
  ): Promise<ReadOnlyResult<ErrType<R>>> {
    const result = await this.ro(tx);
    const value = expectErr(result.value);
    return {
      ...result,
      value: value as ErrType<R>,
    };
  }

  public async rovOk<R extends Response<unknown, unknown>>(
    tx: ContractCall<R>
  ): Promise<OkType<R>> {
    return (await this.roOk(tx)).value;
  }

  public async rovErr<R extends Response<unknown, unknown>>(
    tx: ContractCall<R>
  ): Promise<ErrType<R>> {
    return (await this.roErr(tx)).value;
  }

  public tx<R extends Response<unknown, unknown>>(tx: ContractCall<R>, senderAddress: string) {
    return _tx({
      tx,
      senderAddress,
      bin: this.clarityBin,
      coverageFolder: this.coverageFolder,
    });
  }

  public async txOk<R extends Response<unknown, unknown>>(
    tx: ContractCall<R>,
    senderAddress: string
  ): Promise<PublicResultOk<OkType<R>>> {
    const result = await this.tx(tx, senderAddress);
    const value = expectOk(result.value);
    if (!result.isOk) throw new Error(`Expected OK, received error: ${String(result.value)}`);
    return {
      ...result,
      value: value as OkType<R>,
    };
  }

  public async txErr<R extends Response<unknown, unknown>>(
    tx: ContractCall<R>,
    senderAddress: string
  ): Promise<PublicResultErr<ErrType<R>>> {
    const result = await this.tx(tx, senderAddress);
    const value = expectErr(result.value);
    if (result.isOk) throw new Error(`Expected Err, received ok: ${String(result.value)}`);
    return {
      ...result,
      value: value as ErrType<R>,
    };
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
