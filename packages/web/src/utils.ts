import { deserializeTransaction, PostConditionMode } from 'micro-stacks/transactions';
import { makeContractCallToken } from 'micro-stacks/connect';
import { SubmitOptions, Transaction, WebTransactionReceipt } from '@clarigen/core';
import { StacksNetwork } from 'micro-stacks/network';
import { ClarityValue } from 'micro-stacks/clarity';

export type AppDetails = {
  name: string;
  icon: string;
};

interface TxPayload {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
  network: StacksNetwork;
  privateKey: string;
  stxAddress: string;
  appDetails: AppDetails;
}

export interface ContractCallPayload extends Omit<TxPayload, 'privateKey'> {
  publicKey: string;
  txType: 'contract_call';
  postConditions?: string[];
}

export interface WebTransaction<Ok, Err> extends Transaction<Ok, Err> {
  payload: TxPayload;
}

export function makeTx<Ok, Err>(payload: TxPayload): WebTransaction<Ok, Err> {
  return {
    payload,
    submit: async (options: SubmitOptions): Promise<WebTransactionReceipt<Ok, Err>> => {
      if ('sender' in options) {
        throw new Error('Cannot use test options');
      }
      const token = await makeContractCallToken({
        postConditions: options.postConditions,
        postConditionMode: options.postConditionMode || PostConditionMode.Deny,
        sponsored: options.sponsored,
        // fee: options.fee,
        ...payload,
      });
      if (!window.StacksProvider) {
        throw new Error('Please install the wallet');
      }
      const request = await window.StacksProvider.transactionRequest(token);
      const { txRaw } = request;
      const stacksTransaction = deserializeTransaction(txRaw);
      return {
        txId: request.txId,
        stacksTransaction,
        getResult: () => {
          throw new Error('Not implemented');
        },
      };
    },
  };
}
