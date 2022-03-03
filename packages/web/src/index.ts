import { ContractCall, ro, roOk, roErr, fetchMapGet } from '@clarigen/core';
import { ContractCallTxOptions, makeContractCallToken } from 'micro-stacks/connect';
import { StacksNetwork } from 'micro-stacks/network';
import { deserializeTransaction } from 'micro-stacks/transactions';

export interface WebOptions {
  network: StacksNetwork;
}

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
    tx: (
      _tx: ContractCall<any>,
      txOptions: Omit<
        ContractCallTxOptions,
        'contractName' | 'contractAddress' | 'functionName' | 'functionArgs'
      >
    ) => {
      tx(_tx, txOptions, options);
    },
    mapGet: curry(fetchMapGet, options),
    // tx: curry(tx, options),
  };
}

export { ro, roOk, roErr };

export const mapGet = fetchMapGet;
