import { deserializeCV, hexToCV } from 'micro-stacks/clarity';
import { join } from 'path';
import { cvToValue } from '@clarigen/core';
import { deployContract, evalJson, executeJson } from './clarity-cli-adapter';
import { NativeClarityBinProvider } from '@clarigen/native-bin';
import { IntegerType, intToBigInt } from 'micro-stacks/common';

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

type Provider = NativeClarityBinProvider | { clarityBin: NativeClarityBinProvider };

function getBin(provider: Provider): NativeClarityBinProvider {
  return 'clarityBin' in provider ? provider.clarityBin : provider;
}

export async function getBlockHeight(provider: Provider) {
  const bin = getBin(provider);
  const { output_serialized } = await evalJson({
    contractAddress: UTIL_CONTRACT_ID,
    functionName: 'get-block-height',
    args: [],
    provider: bin,
  });
  const outputCV = hexToCV(output_serialized);
  const blockHeight: bigint = cvToValue(outputCV);
  return blockHeight;
}

export async function mineBlock(provider: Provider) {
  const bin = getBin(provider);
  await executeJson({
    contractAddress: UTIL_CONTRACT_ID,
    functionName: 'mine-block',
    args: [],
    provider: bin,
    senderAddress: 'ST000000000000000000002AMW42H',
  });
}

export async function mineBlocks(_blocks: IntegerType, provider: Provider) {
  const blocks = intToBigInt(_blocks);
  for (let index = 0; index < blocks; index++) {
    await mineBlock(provider);
  }
}

export async function getStxBalance(provider: Provider, account: string) {
  const bin = getBin(provider);
  const { output_serialized } = await evalJson({
    contractAddress: UTIL_CONTRACT_ID,
    functionName: 'get-stx-balance',
    args: [`'${account}`],
    provider: bin,
  });
  const outputCV = hexToCV(output_serialized);
  const balance: bigint = cvToValue(outputCV);
  return balance;
}
