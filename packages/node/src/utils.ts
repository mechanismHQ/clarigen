import { StacksNetwork } from 'micro-stacks/network';
import { SubmitOptions, Transaction, WebTransactionReceipt } from '@clarigen/core';
import {
  makeContractCall,
  SignedContractCallOptions,
  broadcastTransaction,
  AnchorMode,
} from 'micro-stacks/transactions';
import { ClarityValue } from 'micro-stacks/clarity';

export interface ReadOnlyResult<T> {
  value: T;
}

interface TxPayload {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
  network: StacksNetwork;
  privateKey: string;
  nonce?: string;
}

export interface ContractCallPayload extends Omit<TxPayload, 'privateKey'> {
  publicKey: string;
  txType: 'contract_call';
  postConditions?: string[];
}

export interface NodeTransaction<Ok, Err> extends Transaction<Ok, Err> {
  payload: TxPayload;
  submit: (options?: SubmitOptions) => Promise<WebTransactionReceipt<Ok, Err>>;
}

export function makeTx<Ok, Err>(payload: TxPayload): NodeTransaction<Ok, Err> {
  return {
    payload,
    submit: async (_options?: SubmitOptions): Promise<WebTransactionReceipt<Ok, Err>> => {
      const options: SubmitOptions = _options || {};
      if ('sender' in options) {
        throw new Error('Cannot use test options');
      }
      const contractOptions: SignedContractCallOptions = {
        contractAddress: payload.contractAddress,
        contractName: payload.contractName,
        functionName: payload.functionName,
        functionArgs: payload.functionArgs,
        senderKey: payload.privateKey,
        network: payload.network,
        postConditions: options.postConditions,
        postConditionMode: options.postConditionMode,
        anchorMode: AnchorMode.Any,
        sponsored: options.sponsored,
        // fee: new BN(10000, 10),
      };
      if ('nonce' in options && typeof options.nonce !== 'undefined') {
        contractOptions.nonce = options.nonce;
      }
      const tx = await makeContractCall(contractOptions);
      // TEMP: workaround for micro-stacks issue: https://github.com/fungible-systems/micro-stacks/pull/75
      const broadcastResponse: any = await broadcastTransaction(tx, payload.network);
      if ('error' in broadcastResponse) {
        throw new Error(
          `Error broadcasting transaction: ${broadcastResponse.error} - ${broadcastResponse.reason}`
        );
      }
      let txid: string;
      if ('txid' in broadcastResponse) {
        txid = broadcastResponse.txid;
      } else {
        txid = broadcastResponse;
      }
      return {
        txId: txid,
        stacksTransaction: tx,
        getResult: () => {
          throw new Error('Not implemented');
        },
      };
    },
  };
}

export async function tx<A, B>(
  _tx: Transaction<A, B>,
  options?: SubmitOptions
): Promise<WebTransactionReceipt<A, B>> {
  const tx = _tx as NodeTransaction<A, B>;
  const receipt = await tx.submit(options);
  return receipt;
}
