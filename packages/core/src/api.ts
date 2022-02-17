import { parseReadOnlyResponse, ReadOnlyFunctionResponse } from 'micro-stacks/api';
import { cvToHex } from 'micro-stacks/clarity';
import { fetchPrivate } from 'micro-stacks/common';
import { StacksNetwork } from 'micro-stacks/network';
import { broadcastTransaction, StacksTransaction } from 'micro-stacks/transactions';
import { ClarityTypes, cvToValue, expectErr, expectOk } from './clarity-types';
import { ContractCall } from './pure';

interface ApiOptions {
  network: StacksNetwork;
}

export async function ro<T>(tx: ContractCall<T>, options: ApiOptions): Promise<T> {
  const urlBase = options.network.getReadOnlyFunctionCallApiUrl(
    tx.contractAddress,
    tx.contractName,
    tx.function.name
  );
  const url = `${urlBase}?tip=latest`;
  const body = JSON.stringify({
    sender: tx.contractAddress,
    arguments: tx.functionArgs.map(arg => (typeof arg === 'string' ? arg : cvToHex(arg))),
  });
  const response = await fetchPrivate(url, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    let msg = '';
    try {
      msg = await response.text();
    } catch (error) {}
    throw new Error(
      `Error calling read-only function. Response ${response.status}: ${response.statusText}. Attempted to fetch ${url} and failed with the message: "${msg}"`
    );
  }
  const parsed = parseReadOnlyResponse((await response.json()) as ReadOnlyFunctionResponse);
  return cvToValue(parsed, true);
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
