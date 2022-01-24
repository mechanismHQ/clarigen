import { ContractCall, broadcast, ro, roOk, roErr } from '@clarigen/core';
import { StacksNetwork } from 'micro-stacks/network';
import { AnchorMode, makeContractCall, ContractCallOptions } from 'micro-stacks/transactions';

export interface NodeOptions {
  network: StacksNetwork;
  privateKey?: string;
}

export async function tx(
  tx: ContractCall<any>,
  txOptions: Partial<ContractCallOptions>,
  options: NodeOptions
) {
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
    ...txOptions,
  });
  return broadcast(transaction, options);
}

type Fn<A, R> = (arg: A, options: NodeOptions) => R;

function curry<A, R>(f: Fn<A, R>, options: NodeOptions) {
  return (arg: A) => f(arg, options);
}

export function NodeProvider(options: NodeOptions) {
  return {
    ro: curry(ro, options),
    roOk: curry(roOk, options),
    roErr: curry(roErr, options),
    tx: (_tx: ContractCall<any>, txOptions: Partial<ContractCallOptions>) =>
      tx(_tx, txOptions, options),
  };
}
