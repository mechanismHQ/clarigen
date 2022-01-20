import { cvToValue, ContractCall, ClarityTypes } from '@clarigen/core';
import { StacksNetwork } from 'micro-stacks/network';
import { callReadOnlyFunction } from 'micro-stacks/api';
import { AnchorMode, makeContractCall } from 'micro-stacks/transactions';
import { broadcastTransaction } from 'micro-stacks/transactions';

export interface ReadOnlyOptions {
  network: StacksNetwork;
}

export async function ro<T>(tx: ContractCall<T>, options: ReadOnlyOptions): Promise<T> {
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
  options: ReadOnlyOptions
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

export interface PublicOptions extends ReadOnlyOptions {
  privateKey: string;
}

export async function tx(tx: ContractCall<any>, options: PublicOptions) {
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

export function PureProvider(options: PublicOptions) {
  return {
    ro: function <T>(tx: ContractCall<T>) {
      return ro(tx, options);
    },
    roOk: function <Ok>(tx: ContractCall<ClarityTypes.Response<Ok, any>>) {
      return roOk(tx, options);
    },
    tx: function (_tx: ContractCall<any>) {
      return tx(_tx, options);
    },
  };
}
