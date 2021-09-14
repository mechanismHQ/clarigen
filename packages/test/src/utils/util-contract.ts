import { deserializeCV } from '@stacks/transactions';
import { join } from 'path';
import { cvToValue } from '@clarigen/core';
import { deployContract, evalJson, executeJson } from './clarity-cli-adapter';
import { NativeClarityBinProvider } from '@clarigen/native-bin';

export const UTIL_CONTRACT_ID = 'ST000000000000000000002AMW42H.clarigen-test-utils';

export async function deployUtilContract(clarityBin: NativeClarityBinProvider) {
  let contractFilePath = join(__dirname, '..', '..', 'contracts', 'test-utils.clar');
  if (__dirname.includes('dist')) {
    contractFilePath = join(__dirname, '..', 'contracts', 'test-utils.clar');
  }
  await deployContract({
    contractIdentifier: UTIL_CONTRACT_ID,
    provider: clarityBin,
    contractFilePath,
  });
}

export async function getBlockHeight(provider: NativeClarityBinProvider) {
  const { output_serialized } = await evalJson({
    contractAddress: UTIL_CONTRACT_ID,
    functionName: 'get-block-height',
    args: [],
    provider,
  });
  const outputCV = deserializeCV(Buffer.from(output_serialized, 'hex'));
  const blockHeight: number = cvToValue(outputCV);
  return blockHeight;
}

export async function mineBlock(provider: NativeClarityBinProvider) {
  await executeJson({
    contractAddress: UTIL_CONTRACT_ID,
    functionName: 'mine-block',
    args: [],
    provider,
    senderAddress: 'ST000000000000000000002AMW42H',
  });
}

export async function mineBlocks(blocks: number, provider: NativeClarityBinProvider) {
  for (let index = 0; index < blocks; index++) {
    await mineBlock(provider);
  }
}

export async function getStxBalance(provider: NativeClarityBinProvider, account: string) {
  const { output_serialized } = await evalJson({
    contractAddress: UTIL_CONTRACT_ID,
    functionName: 'get-stx-balance',
    args: [`'${account}`],
    provider,
  });
  const outputCV = deserializeCV(Buffer.from(output_serialized, 'hex'));
  const balance: number = cvToValue(outputCV);
  return balance;
}
