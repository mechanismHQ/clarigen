import { createClarityBin, NativeClarityBinProvider } from '@clarigen/native-bin';
import {
  ContractInstances,
  Contracts,
  getContractIdentifier,
  ContractCall,
  ContractCalls,
  ClarityTypes,
} from '@clarigen/core';
import { deployContract, deployUtilContract, ClarinetAccounts } from './utils';
import {
  PublicResult,
  PublicResultErr,
  PublicResultOk,
  ReadOnlyResult,
  ro,
  tx as _tx,
} from './utils/pure';
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

interface FromContractsOptions {
  accounts?: ClarinetAccounts;
  clarityBin?: NativeClarityBinProvider;
}

interface FromContracts<T extends Contracts<M>, M> {
  deployed: ContractInstances<T, M>;
  provider: TestProvider;
}

export class TestProvider {
  public clarityBin: NativeClarityBinProvider;

  constructor(clarityBin: NativeClarityBinProvider) {
    this.clarityBin = clarityBin;
  }

  public static async fromContracts<T extends Contracts<M>, M>(
    contracts: T,
    options: FromContractsOptions = {}
  ): Promise<FromContracts<T, M>> {
    const clarityBin = options.clarityBin || (await createClarityBin());
    const instances = {} as ContractInstances<T, M>;
    await deployUtilContract(clarityBin);
    for (const k in contracts) {
      if (Object.prototype.hasOwnProperty.call(contracts, k)) {
        const contract = contracts[k];
        const identifier = getContractIdentifier(contract);
        await deployContract({
          contractIdentifier: identifier,
          contractFilePath: contract.contractFile,
          provider: clarityBin,
        });
        const instance = contract.contract(contract.address, contract.name);
        instances[k] = {
          identifier: getContractIdentifier(contract),
          contract: instance as ReturnType<T[typeof k]['contract']>,
        };
      }
    }
    const provider = new this(clarityBin);
    return {
      deployed: instances,
      provider,
    };
  }

  public ro<T>(tx: ContractCall<T>): Promise<ReadOnlyResult<T>> {
    return ro(tx, this.clarityBin);
  }

  public async rov<T>(tx: ContractCall<T>): Promise<T> {
    const result = await this.ro(tx);
    return result.value;
  }

  public async roOk<Ok, Err>(
    tx: ContractCall<ClarityTypes.Response<Ok, Err>>
  ): Promise<ReadOnlyResult<Ok>> {
    const result = await this.ro(tx);
    return result.value.match(
      ok => {
        return {
          ...result,
          value: ok,
        };
      },
      err => {
        throw new Error(`Expected OK, received error: ${err}`);
      }
    );
  }

  public async roErr<Ok, Err>(
    tx: ContractCall<ClarityTypes.Response<Ok, Err>>
  ): Promise<ReadOnlyResult<Err>> {
    const result = await this.ro(tx);
    return result.value.match(
      ok => {
        throw new Error(`Expected err, received ok: ${ok}`);
      },
      err => {
        return {
          ...result,
          value: err,
        };
      }
    );
  }

  public async rovOk<Ok, Err>(tx: ContractCall<ClarityTypes.Response<Ok, Err>>): Promise<Ok> {
    return (await this.roOk(tx)).value;
  }

  public async rovErr<Ok, Err>(tx: ContractCall<ClarityTypes.Response<Ok, Err>>): Promise<Err> {
    return (await this.roErr(tx)).value;
  }

  public tx<Ok, Err>(tx: ContractCalls.Public<Ok, Err>, senderAddress: string) {
    return _tx({
      tx,
      senderAddress,
      bin: this.clarityBin,
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
}
