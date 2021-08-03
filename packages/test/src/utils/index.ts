import { Transaction } from '@clarigen/core';
export * from './clarity-cli-adapter';
export * from './util-contract';

export async function tx<A, B>(tx: Transaction<A, B>, sender: string) {
  const receipt = await tx.submit({ sender });
  const result = await receipt.getResult();
  return result;
}

export async function txOk<A, B>(_tx: Transaction<A, B>, sender: string) {
  const result = await tx(_tx, sender);
  if (!result.isOk) throw new Error(`Expected transaction ok, got error: ${result.value}`);
  return result;
}

export async function txErr<A, B>(_tx: Transaction<A, B>, sender: string) {
  const result = await tx(_tx, sender);
  if (result.isOk) throw new Error(`Expected transaction error, got ok: ${result.value}`);
  return result;
}
