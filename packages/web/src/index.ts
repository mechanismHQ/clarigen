import {
  ContractCall,
  ro,
  roOk,
  roErr,
  fetchMapGet,
  ApiOptions,
  Response,
  JsonIfOption,
} from '@clarigen/core';
import { ContractCallTxOptions, FinishedTxData, makeContractCallToken } from 'micro-stacks/connect';
import { deserializeTransaction } from 'micro-stacks/transactions';
import { ContractCallParams, MicroStacksClient, TxType } from '@micro-stacks/client';
import { StacksNetwork } from 'micro-stacks/network';

export type WebOptions = Omit<ApiOptions, 'network'> & { network: StacksNetwork };

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
    ...options,
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

// type Fn<A, R, O> = (arg: A, options: O) => R;

// function curry<A, R, O>(f: Fn<A, R, O>, options: O) {
//   return (arg: A) => f(arg, options);
// }

// export function WebProvider(options: WebOptions) {
//   return {
//     // ro:
//     ro: curry(ro, options),
//     roOk: curry(roOk, options),
//     roErr: curry(roErr, options),
//     tx: async (
//       _tx: ContractCall<any>,
//       txOptions: Omit<
//         ContractCallTxOptions,
//         'contractName' | 'contractAddress' | 'functionName' | 'functionArgs'
//       >
//     ) => {
//       await tx(_tx, txOptions, options);
//     },
//     // mapGet: curry(fetchMapGet, options),
//     // tx: curry(tx, options),
//   };
// }

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

type JsonIf<O extends ClientRoOptions, T> = JsonIfOption<O & { network: StacksNetwork }, T>;

export class ClarigenClient {
  public microStacks: MicroStacksClient;

  constructor(client: MicroStacksClient) {
    this.microStacks = client;
  }

  public get network(): StacksNetwork {
    return this.microStacks.getState().network;
  }

  async openContractCall(
    tx: ContractCall<any>,
    txOptions?: Omit<
      ContractCallTxOptions,
      'contractName' | 'contractAddress' | 'functionName' | 'functionArgs' | 'network'
    > & { network?: StacksNetwork }
  ): Promise<FinishedTxData | undefined> {
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

  ro<T, O extends ClientRoOptions>(tx: ContractCall<T>, options?: O): Promise<JsonIf<O, T>> {
    return ro(tx, this.roOptions(options || {})) as Promise<JsonIf<O, T>>;
  }

  roOk<T, O extends ClientRoOptions>(
    tx: ContractCall<Response<T, any>>,
    options?: O
  ): Promise<JsonIf<O, T>> {
    return roOk(tx, this.roOptions(options || {})) as Promise<JsonIf<O, T>>;
  }

  roErr<T, O extends ClientRoOptions>(
    tx: ContractCall<Response<any, T>>,
    options?: O
  ): Promise<JsonIf<O, T>> {
    return roErr(tx, this.roOptions(options || {})) as Promise<JsonIf<O, T>>;
  }
}

export { ro, roOk, roErr };

export const mapGet = fetchMapGet;
