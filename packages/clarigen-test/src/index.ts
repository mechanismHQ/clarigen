import { ContractCallTyped, ErrType, OkType, UnknownArgs } from '@clarigen/core';
import { Simnet, ParsedTransactionResult } from '@hirosystems/clarinet-sdk';
import { cvConvertMS, validateResponse } from './utils';

declare global {
  let simnet: Simnet;
}

export type TransactionResult<R> = ParsedTransactionResult & {
  value: R;
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
    value,
  };
}

export function ro<A extends UnknownArgs, R>(tx: ContractCallTyped<A, R>, sender: string): R {
  const args = tx.functionArgs.map(cvConvertMS);
  const contractId = `${tx.contractAddress}.${tx.contractName}`;
  const receipt = simnet.callReadOnlyFn(contractId, tx.function.name, args, sender);
  const value = validateResponse<R>(receipt.result);

  return value;
}

export function roOk<A extends UnknownArgs, R>(
  tx: ContractCallTyped<A, R>,
  sender: string
): OkType<R> {
  const args = tx.functionArgs.map(cvConvertMS);
  const contractId = `${tx.contractAddress}.${tx.contractName}`;
  const receipt = simnet.callReadOnlyFn(contractId, tx.function.name, args, sender);
  const value = validateResponse<OkType<R>>(receipt.result, true);

  return value;
}

export function roErr<A extends UnknownArgs, R>(
  tx: ContractCallTyped<A, R>,
  sender: string
): ErrType<R> {
  const args = tx.functionArgs.map(cvConvertMS);
  const contractId = `${tx.contractAddress}.${tx.contractName}`;
  const receipt = simnet.callReadOnlyFn(contractId, tx.function.name, args, sender);
  const value = validateResponse<ErrType<R>>(receipt.result, false);

  return value;
}

// Helper export for previous Deno-based tests
export const chain = {
  txOk,
  txErr,
  tx,
  ro,
  roOk,
  roErr,
};

export async function makeNewSession(cwd?: string, manifestPath?: string) {
  await simnet.initSession(cwd ?? process.cwd(), manifestPath ?? './Clarinet.toml');
}
