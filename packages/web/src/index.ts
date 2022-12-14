import { ContractCall, ro, roOk, roErr, fetchMapGet, ApiOptions, Response } from '@clarigen/core';
import { ContractCallTxOptions, makeContractCallToken } from 'micro-stacks/connect';
import { deserializeTransaction } from 'micro-stacks/transactions';
import { ContractCallParams, MicroStacksClient, TxType } from '@micro-stacks/client';

export type WebOptions = ApiOptions;

export type ContractCallExtra = Omit<
  ContractCallParams,
  'contractName' | 'contractAddress' | 'functionName' | 'functionArgs'
>;

export async function tx(
  tx: ContractCall<any>,
  txOptions: Omit<
    ContractCallTxOptions,
    'contractName' | 'contractAddress' | 'functionName' | 'functionArgs'
  >,
  options?: WebOptions
) {
  const token = await makeContractCallToken({
    functionArgs: tx.functionArgs,
    functionName: tx.function.name,
    contractAddress: tx.contractAddress,
    contractName: tx.contractName,
    network: options?.network,
    ...txOptions,
  });
  if (!window.StacksProvider) {
    throw new Error('Stacks wallet not installed.');
  }
  const request = await window.StacksProvider.transactionRequest(token);
  const { txRaw } = request;
  const stacksTransaction = deserializeTransaction(txRaw);
  return {
    txId: request.txId,
    stacksTransaction,
  };
}

type Fn<A, R> = (arg: A, options: WebOptions) => R;

function curry<A, R>(f: Fn<A, R>, options: WebOptions) {
  return (arg: A) => f(arg, options);
}

export function WebProvider(options: WebOptions) {
  return {
    ro: curry(ro, options),
    roOk: curry(roOk, options),
    roErr: curry(roErr, options),
    tx: async (
      _tx: ContractCall<any>,
      txOptions: Omit<
        ContractCallTxOptions,
        'contractName' | 'contractAddress' | 'functionName' | 'functionArgs'
      >
    ) => {
      await tx(_tx, txOptions, options);
    },
    mapGet: curry(fetchMapGet, options),
    // tx: curry(tx, options),
  };
}

// export const Clarigen = WebProvider;

export function transformTx(tx: ContractCall<any>, options: ContractCallExtra): ContractCallParams {
  return {
    functionArgs: tx.functionArgs,
    functionName: tx.function.name,
    contractAddress: tx.contractAddress,
    contractName: tx.contractName,
    ...options,
  };
}

type ClientRoOptions = Omit<ApiOptions, 'network'>;

export class ClarigenClient {
  public microStacks: MicroStacksClient;

  constructor(client: MicroStacksClient) {
    this.microStacks = client;
  }

  public get network() {
    return this.microStacks.getState().network;
  }

  async openContractCall(
    tx: ContractCall<any>,
    txOptions?: Omit<
      ContractCallTxOptions,
      'contractName' | 'contractAddress' | 'functionName' | 'functionArgs'
    >
  ) {
    return this.microStacks.signTransaction(TxType.ContractCall, {
      functionArgs: tx.functionArgs,
      functionName: tx.function.name,
      contractAddress: tx.contractAddress,
      contractName: tx.contractName,
      ...txOptions,
    });
  }

  private roOptions(options: ClientRoOptions): ApiOptions {
    return {
      network: this.network,
      ...options,
    };
  }

  async ro<T>(tx: ContractCall<T>, options?: ClientRoOptions) {
    return ro(tx, this.roOptions(options || {})));
  }

  async roOk<T>(tx: ContractCall<Response<T, any>>, options?: ClientRoOptions) {
    return roOk(tx, this.roOptions(options || {}));
  }

  async roErr<T>(tx: ContractCall<Response<any, T>>, options?: ClientRoOptions) {
    return roErr(tx, this.roOptions(options || {}));
  }
}

export { ro, roOk, roErr };

export const mapGet = fetchMapGet;
