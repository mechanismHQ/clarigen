import { getPublicKey } from 'noble-secp256k1';
import { TokenSigner, Json } from 'stacks-crypto';
import {
  BufferReader,
  deserializeTransaction,
  serializeCV,
  serializePostCondition,
} from '@stacks/transactions';
import type { PostCondition } from '@stacks/transactions';
import { SubmitOptions, Transaction, WebSignerOptions, WebTransactionReceipt } from '@clarion/core';
import { StacksNetwork } from '@stacks/network';

export type AppDetails = {
  name: string;
  icon: string;
};

interface TxPayload {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: string[];
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
      const postConditions = serializePostConditions(options.postConditions);
      const token = await makeContractCallToken({
        postConditions,
        ...payload,
      });
      if (!window.StacksProvider) {
        throw new Error('Please install the wallet');
      }
      const request = await window.StacksProvider.transactionRequest(token);
      const { txRaw } = request;
      const txBuffer = Buffer.from(txRaw.replace(/^0x/, ''), 'hex');
      const stacksTransaction = deserializeTransaction(new BufferReader(txBuffer));
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

async function makeContractCallToken(options: TxPayload & { postConditions?: string[] }) {
  const { functionArgs, privateKey, ...rest } = options;
  const args: string[] = functionArgs.map(arg => {
    if (typeof arg === 'string') {
      return arg;
    }
    return serializeCV(arg).toString('hex');
  });
  // const defaults = getDefaults(signer);
  const publicKey = getPublicKey(privateKey, true);
  const payload: ContractCallPayload = {
    functionArgs: args,
    txType: 'contract_call',
    publicKey,
    ...rest,
  };

  const tokenSigner = new TokenSigner('ES256k', privateKey);
  const token = await tokenSigner.sign(payload as any);
  return token;
}

function serializePostConditions(postConditions?: PostCondition[]): string[] {
  let pcSerialized: string[] = [];
  if (postConditions && typeof postConditions[0] !== 'string') {
    pcSerialized = postConditions.map(pc => serializePostCondition(pc).toString('hex'));
  }
  return pcSerialized;
}
