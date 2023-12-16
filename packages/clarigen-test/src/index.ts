import {
  ContractCallTyped,
  ErrType,
  OkType,
  TypedAbiMap,
  TypedAbiVariable,
  UnknownArgs,
  cvToValue,
  mapFactory,
  rawClarityToValue,
} from '@clarigen/core';
import { Simnet, ParsedTransactionResult } from '@hirosystems/clarinet-sdk';
import { cvConvertHiro, cvConvertMS, validateResponse } from './utils';
import { CoreNodeEvent } from './events';
import { ClarityType } from '@stacks/transactions';
export * from './events';

declare global {
  let simnet: Simnet;
}

export type TransactionResult<R> = Omit<ParsedTransactionResult, 'events'> & {
  value: R;
  events: CoreNodeEvent[];
};

export function txOk<A extends UnknownArgs, R>(
  tx: ContractCallTyped<A, R>,
  sender: string
): TransactionResult<OkType<R>> {
  const args = tx.functionArgs.map(cvConvertMS);
  const contractId = `${tx.contractAddress}.${tx.contractName}`;
  const receipt = simnet.callPublicFn(contractId, tx.function.name, args, sender);
  const value = validateResponse<OkType<R>>(receipt.result, true);

  return {
    ...receipt,
    events: receipt.events as unknown as CoreNodeEvent[],
    value,
  };
}

export function txErr<A extends UnknownArgs, R>(
  tx: ContractCallTyped<A, R>,
  sender: string
): TransactionResult<ErrType<R>> {
  const args = tx.functionArgs.map(cvConvertMS);
  const contractId = `${tx.contractAddress}.${tx.contractName}`;
  const receipt = simnet.callPublicFn(contractId, tx.function.name, args, sender);
  const value = validateResponse<ErrType<R>>(receipt.result, false);

  return {
    ...receipt,
    events: receipt.events as unknown as CoreNodeEvent[],
    value,
  };
}

export function tx<A extends UnknownArgs, R>(
  tx: ContractCallTyped<A, R>,
  sender: string
): TransactionResult<R> {
  const args = tx.functionArgs.map(cvConvertMS);
  const contractId = `${tx.contractAddress}.${tx.contractName}`;
  const receipt = simnet.callPublicFn(contractId, tx.function.name, args, sender);
  const value = validateResponse<R>(receipt.result);

  return {
    ...receipt,
    events: receipt.events as unknown as CoreNodeEvent[],
    value,
  };
}

export function ro<A extends UnknownArgs, R>(
  tx: ContractCallTyped<A, R>,
  sender?: string
): TransactionResult<R> {
  const args = tx.functionArgs.map(cvConvertMS);
  const contractId = `${tx.contractAddress}.${tx.contractName}`;
  const receipt = simnet.callReadOnlyFn(
    contractId,
    tx.function.name,
    args,
    sender ?? tx.contractAddress
  );
  const value = validateResponse<R>(receipt.result);
  return {
    ...receipt,
    events: receipt.events as unknown as CoreNodeEvent[],
    value,
  };

  // return value;
}

export function rov<A extends UnknownArgs, R>(tx: ContractCallTyped<A, R>, sender?: string): R {
  return ro(tx, sender).value;
}

export function roOk<A extends UnknownArgs, R>(
  tx: ContractCallTyped<A, R>,
  sender?: string
): TransactionResult<OkType<R>> {
  const args = tx.functionArgs.map(cvConvertMS);
  const contractId = `${tx.contractAddress}.${tx.contractName}`;
  const receipt = simnet.callReadOnlyFn(
    contractId,
    tx.function.name,
    args,
    sender ?? tx.contractAddress
  );
  const value = validateResponse<OkType<R>>(receipt.result, true);
  return {
    ...receipt,
    events: receipt.events as unknown as CoreNodeEvent[],
    value,
  };

  // return value;
}

export function rovOk<A extends UnknownArgs, R>(
  tx: ContractCallTyped<A, R>,
  sender?: string
): OkType<R> {
  return roOk(tx, sender).value;
}

export function roErr<A extends UnknownArgs, R>(
  tx: ContractCallTyped<A, R>,
  sender?: string
): TransactionResult<ErrType<R>> {
  const args = tx.functionArgs.map(cvConvertMS);
  const contractId = `${tx.contractAddress}.${tx.contractName}`;
  const receipt = simnet.callReadOnlyFn(
    contractId,
    tx.function.name,
    args,
    sender ?? tx.contractAddress
  );
  const value = validateResponse<ErrType<R>>(receipt.result, false);

  return {
    ...receipt,
    events: receipt.events as unknown as CoreNodeEvent[],
    value,
  };

  // return value;
}

export function rovErr<A extends UnknownArgs, R>(
  tx: ContractCallTyped<A, R>,
  sender?: string
): ErrType<R> {
  return roErr(tx, sender).value;
}

export function mapGet<Key, Val>(contractId: string, map: TypedAbiMap<Key, Val>, key: Key) {
  const payload = mapFactory(map, key);
  const result = simnet.getMapEntry(contractId, payload.map.name, cvConvertMS(payload.keyCV));
  return cvToValue<Val | null>(cvConvertHiro(result));
}

export function varGet<T>(contractId: string, variable: TypedAbiVariable<T>) {
  const result = simnet.getDataVar(contractId, variable.name);
  return cvToValue<T>(cvConvertHiro(result));
}

// Helper export for previous Deno-based tests
export const chain = {
  txOk,
  txErr,
  tx,
  ro,
  roOk,
  roErr,
  rov,
  rovOk,
  rovErr,
};

export async function makeNewSession(cwd?: string, manifestPath?: string) {
  await simnet.initSession(cwd ?? process.cwd(), manifestPath ?? './Clarinet.toml');
}
