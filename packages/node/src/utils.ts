import { StacksNetwork } from '@stacks/network';
import { SubmitOptions, Transaction, WebTransactionReceipt } from '@clarigen/core';
import {
  makeContractCall,
  ClarityValue,
  SignedContractCallOptions,
  broadcastTransaction,
  AnchorMode,
} from '@stacks/transactions';
import BN from 'bn.js';

interface TxPayload {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
  network: StacksNetwork;
  privateKey: string;
  nonce?: string;
  // privateKey: string;
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
      if ('nonce' in options && options.nonce) {
        contractOptions.nonce = new BN(options.nonce, 10);
      }
      const tx = await makeContractCall(contractOptions);
      const broadcastResponse = await broadcastTransaction(tx, payload.network);
      if (broadcastResponse.error) {
        throw new Error(
          `Error broadcasting transaction: ${broadcastResponse.error} - ${broadcastResponse.reason}`
        );
      }
      return {
        txId: broadcastResponse.txid,
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
