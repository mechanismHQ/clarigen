import { fetchContractDataMapEntry, callReadOnlyFunction } from 'micro-stacks/api';
import { cvToHex, hexToCV } from 'micro-stacks/clarity';
import { StacksNetwork } from 'micro-stacks/network';
import { broadcastTransaction, StacksTransaction } from 'micro-stacks/transactions';
import { cvToValue, expectErr, expectOk } from './clarity-types';
import { ContractCalls } from './pure';
import { Response } from './abi-types';
import { ContractCall } from './factory-types';

export interface ApiOptions {
  network: StacksNetwork;
  tip?: string;
  latest?: boolean;
}

function getTip(options: ApiOptions): string | undefined {
  if (options.latest === false) return undefined;
  if (options.latest) return 'latest';
  return options.tip;
}

export async function ro<T>(tx: ContractCall<T>, options: ApiOptions): Promise<T> {
  const tip = getTip(options);
  const cv = await callReadOnlyFunction({
    contractAddress: tx.contractAddress,
    contractName: tx.contractName,
    functionName: tx.function.name,
    functionArgs: tx.functionArgs,
    tip,
  });
  return cvToValue(cv, true);
}

export async function roOk<Ok>(
  tx: ContractCall<Response<Ok, any>>,
  options: ApiOptions
): Promise<Ok> {
  const result = await ro(tx, options);
  return expectOk(result);
}

export async function roErr<Err>(
  tx: ContractCall<Response<any, Err>>,
  options: ApiOptions
): Promise<Err> {
  const result = await ro(tx, options);
  return expectErr(result);
}

export async function fetchMapGet<T extends ContractCalls.Map<any, Val>, Val>(
  map: T,
  options: ApiOptions
): Promise<Val | null> {
  const lookupKey = cvToHex(map.key);
  const response = await fetchContractDataMapEntry({
    contract_address: map.contractAddress,
    contract_name: map.contractName,
    map_name: map.map.name,
    lookup_key: lookupKey,
    tip: 'latest',
    url: options.network.getCoreApiUrl(),
    proof: 0,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const valueCV = hexToCV(response.data);
  return cvToValue(valueCV, true);
}

export async function broadcast(transaction: StacksTransaction, options: ApiOptions) {
  const result = await broadcastTransaction(transaction, options.network);
  if ('error' in result) {
    throw new Error(
      `Error broadcasting tx: ${result.error} - ${result.reason} - ${JSON.stringify(
        result.reason_data
      )}`
    );
  } else {
    return {
      txId: result.txid,
      stacksTransaction: transaction,
    };
  }
}
