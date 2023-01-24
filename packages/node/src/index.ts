import {
  ContractCall,
  broadcast,
  ro,
  roOk,
  roErr,
  Response,
  JsonIfOption,
  ApiOptions,
} from '@clarigen/core';
import { StacksNetwork } from 'micro-stacks/network';
import { AnchorMode, makeContractCall, ContractCallOptions } from 'micro-stacks/transactions';

export interface NodeOptions {
  network: StacksNetwork;
  privateKey?: string;
}

export async function tx(
  tx: ContractCall<any>,
  txOptions: Omit<
    ContractCallOptions,
    'contractName' | 'contractAddress' | 'functionName' | 'functionArgs'
  >,
  options: NodeOptions
) {
  if (typeof options.privateKey === 'undefined')
    throw new Error('Clarigen: `privateKey` is mandatory for making transactions');
  const transaction = await makeContractCall({
    contractAddress: tx.contractAddress,
    contractName: tx.contractName,
    functionArgs: tx.functionArgs,
    functionName: tx.function.name,
    network: options.network,
    senderKey: options.privateKey,
    // anchorMode: AnchorMode.Any,
    ...txOptions,
  });
  return broadcast(transaction, options);
}

// type Fn<A, R> = (arg: A, options: NodeOptions) => R;

// function curry<A, R>(f: Fn<A, R>, options: NodeOptions) {
//   return (arg: A) => f(arg, options);
// }

// export function NodeProvider(options: NodeOptions) {
//   return {
//     ro: curry(ro, options),
//     roOk: curry(roOk, options),
//     roErr: curry(roErr, options),
//     mapGet: curry(fetchMapGet, options),
//     tx: (_tx: ContractCall<any>, txOptions: Partial<ContractCallOptions>) =>
//       tx(_tx, txOptions, options),
//   };
// }

// // export const ClarigenNodeClient = NodeProvider;

type ClientRoOptions = Omit<ApiOptions, 'network'>;

type JsonIf<O extends ClientRoOptions, T> = JsonIfOption<O & { network: StacksNetwork }, T>;

export class ClarigenNodeClient {
  public network: StacksNetwork;

  constructor(network: StacksNetwork) {
    this.network = network;
  }

  async signContractCall(
    _tx: ContractCall<any>,
    txOptions: Omit<
      ContractCallOptions,
      'contractName' | 'contractAddress' | 'functionName' | 'functionArgs'
    >
  ) {
    return tx(_tx, txOptions, {
      network: this.network,
    });
  }

  private roOptions(options: ClientRoOptions): ApiOptions {
    return {
      network: this.network,
      ...options,
    };
  }

  async ro<T, O extends ClientRoOptions>(tx: ContractCall<T>, options?: O): Promise<JsonIf<O, T>> {
    return ro(tx, this.roOptions(options || {})) as JsonIf<O, T>;
  }

  async roOk<T, O extends ClientRoOptions>(
    tx: ContractCall<Response<T, any>>,
    options?: O
  ): Promise<JsonIf<O, T>> {
    return roOk(tx, this.roOptions(options || {})) as JsonIf<O, T>;
  }

  async roErr<T, O extends ClientRoOptions>(
    tx: ContractCall<Response<any, T>>,
    options?: O
  ): Promise<JsonIf<O, T>> {
    return roErr(tx, this.roOptions(options || {})) as JsonIf<O, T>;
  }
}
