import { StacksNetwork } from '@stacks/network';
import { SubmitOptions, Transaction, WebTransactionReceipt } from '@clarigen/core';
import {
  makeContractCall,
  ClarityValue,
  SignedContractCallOptions,
  broadcastTransaction,
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
}

export function makeTx<Ok, Err>(payload: TxPayload): NodeTransaction<Ok, Err> {
  return {
    payload,
    submit: async (options: SubmitOptions): Promise<WebTransactionReceipt<Ok, Err>> => {
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
        // fee: new BN(10000, 10),
      };
      if ('nonce' in options && options.nonce) {
        contractOptions.nonce = new BN(options.nonce, 10);
      }
      const tx = await makeContractCall(contractOptions);
      const broadcastResponse = await broadcastTransaction(tx, payload.network);
      if (typeof broadcastResponse === 'string') {
        return {
          txId: broadcastResponse,
          stacksTransaction: tx,
          getResult: () => {
            throw new Error('Not implemented');
          },
        };
      }
      throw new Error(
        `Error broadcasting transaction: ${broadcastResponse.error} - ${broadcastResponse.reason}`
      );
    },
  };
}
