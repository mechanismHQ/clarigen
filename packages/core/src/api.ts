import { callReadOnlyFunction } from 'micro-stacks/api';
import { StacksNetwork } from 'micro-stacks/network';
import { broadcastTransaction, StacksTransaction } from 'micro-stacks/transactions';
import { ClarityTypes, cvToValue, expectErr, expectOk } from './clarity-types';
import { ContractCall } from './pure';

interface ApiOptions {
  network: StacksNetwork;
}

export async function ro<T>(tx: ContractCall<T>, options: ApiOptions): Promise<T> {
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
  options: ApiOptions
): Promise<Ok> {
  const result = await ro(tx, options);
  return expectOk(result);
}

export async function roErr<Err>(
  tx: ContractCall<ClarityTypes.Response<any, Err>>,
  options: ApiOptions
): Promise<Err> {
  const result = await ro(tx, options);
  return expectErr(result);
}

export async function broadcast(transaction: StacksTransaction, options: ApiOptions) {
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
