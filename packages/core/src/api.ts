import { fetchContractDataMapEntry, callReadOnlyFunction } from 'micro-stacks/api';
import { cvToHex, hexToCV } from 'micro-stacks/clarity';
import { StacksNetwork } from 'micro-stacks/network';
import { broadcastTransaction, StacksTransaction } from 'micro-stacks/transactions';
import { cvToJSON, cvToValue, expectErr, expectOk, Jsonize } from './clarity-types';
import { Response, TypedAbiMap } from './abi-types';
import { ContractCall } from './factory-types';
import { mapFactory } from './factory';

export interface ApiOptionsBase {
  network: StacksNetwork;
  tip?: string;
  latest?: boolean;
  // json?: boolean;
}

export interface ApiOptionsJsonize extends ApiOptionsBase {
  json: true;
}

export interface ApiOptionsNoJson extends ApiOptionsBase {
  json?: false | undefined;
}

export interface ApiOptions extends ApiOptionsBase {
  json?: boolean;
}

export type JsonIfOption<O extends ApiOptions, R> = O extends ApiOptionsJsonize ? Jsonize<R> : R;

// export type ApiOptions = ApiOptionsJsonize | ApiOptionsNoJson;

function getTip(options: ApiOptions): string | undefined {
  if (options.latest === false) return undefined;
  if (options.latest) return 'latest';
  if (typeof options.tip === 'undefined') return 'latest';
  return options.tip;
}

// export async function ro<O, T>(tx: ContractCall<T>, options: ApiOptionsJsonize): Promise<Jsonize<T>>;
// export async function ro<O, T>(tx: ContractCall<T>, options: ApiOptionsNoJson): Promise<T>;
export async function ro<O extends ApiOptions, T>(
  tx: ContractCall<T>,
  options: O
): Promise<JsonIfOption<O, T>> {
  const tip = getTip(options);
  const cv = await callReadOnlyFunction({
    contractAddress: tx.contractAddress,
    contractName: tx.contractName,
    functionName: tx.functionName,
    functionArgs: tx.functionArgs,
    tip,
    network: options.network,
  });
  if (options.json) {
    return cvToJSON(cv);
  }
  return cvToValue(cv, true);
}

export async function roOk<O extends ApiOptions, Ok>(
  tx: ContractCall<Response<Ok, any>>,
  options: O
): Promise<JsonIfOption<O, Ok>> {
  const result = await ro(tx, options);
  return expectOk(result) as JsonIfOption<O, Ok>;
}

export async function roErr<O extends ApiOptions, Err>(
  tx: ContractCall<Response<any, Err>>,
  options: O
): Promise<JsonIfOption<O, Err>> {
  const result = await ro(tx, options);
  return expectErr(result) as JsonIfOption<O, Err>;
}

export async function fetchMapGet<Key, Val>(
  contractId: string,
  map: TypedAbiMap<Key, Val>,
  key: Key,
  options: ApiOptions
): Promise<Val | null> {
  const payload = mapFactory(map, key);
  const lookupKey = cvToHex(payload.keyCV);
  const [addr, id] = contractId.split('.');
  const response = await fetchContractDataMapEntry({
    contract_address: addr,
    contract_name: id,
    map_name: payload.map.name,
    lookup_key: lookupKey,
    tip: 'latest',
    url: options.network.getCoreApiUrl(),
    proof: 0,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const valueCV = hexToCV(response.data as string);
  return cvToValue<Val | null>(valueCV, true);
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
