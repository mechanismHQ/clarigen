import { cvToValue, ContractCall, ClarityTypes } from '@clarigen/core';
import { StacksNetwork } from 'micro-stacks/network';
import { callReadOnlyFunction } from 'micro-stacks/api';
import { AnchorMode, makeContractCall } from 'micro-stacks/transactions';
import { broadcastTransaction } from 'micro-stacks/transactions';

export interface NodeOptions {
  network: StacksNetwork;
  privateKey?: string;
}

export async function ro<T>(tx: ContractCall<T>, options: NodeOptions): Promise<T> {
  const result = await callReadOnlyFunction({
    contractAddress: tx.contractAddress,
    contractName: tx.contractName,
    functionArgs: tx.functionArgs,
    functionName: tx.function.name,
    network: options.network,
  });
  return cvToValue(result, true);
}

export async function roOk<Ok>(
  tx: ContractCall<ClarityTypes.Response<Ok, any>>,
  options: NodeOptions
): Promise<Ok> {
  const result = await ro(tx, options);
  return result.match(
    ok => {
      return ok;
    },
    err => {
      throw new Error(`Expected OK, received error: ${err}`);
    }
  );
}

export async function tx(tx: ContractCall<any>, options: NodeOptions) {
  if (typeof options.privateKey === 'undefined')
    throw new Error('Clarigen: `privateKey` is mandatory for making transactions');
  const transaction = await makeContractCall({
    contractAddress: tx.contractAddress,
    contractName: tx.contractName,
    functionArgs: tx.functionArgs,
    functionName: tx.function.name,
    network: options.network,
    senderKey: options.privateKey,
    anchorMode: AnchorMode.Any,
  });
  const result = await broadcastTransaction(transaction, options.network);
  if ('error' in result) {
    throw new Error(
      `Error broadcasting tx: ${result.error} - ${result.reason} - ${result.reason_data}`
    );
  } else {
    return {
      txId: result.txid,
      stacksTransaction: transaction,
    };
  }
}

type Fn<A, R> = (arg: A, options: NodeOptions) => R;

function curry<A, R>(f: Fn<A, R>, options: NodeOptions) {
  return (arg: A) => f(arg, options);
}

export function NodeProvider(options: NodeOptions) {
  return {
    ro: curry(ro, options),
    roOk: curry(roOk, options),
    tx: curry(tx, options),
  };
}
