import { NativeClarityBinProvider } from '@blockstack/clarity';
import { TestProvider, createClarityBin, tx, getBlockHeight, mineBlocks } from '../src';
import { SimpleContract } from './contracts/simple';

let contract: SimpleContract;
let provider: NativeClarityBinProvider;

async function deploy() {
  const clarityBin = await createClarityBin();
  await TestProvider.fromContracts({}, clarityBin);
  provider = clarityBin;
}

beforeAll(async () => {
  await deploy();
});

test('can get block height and mine blocks', async () => {
  const startHeight = await getBlockHeight(provider);
  expect(startHeight).toEqual(3n);
  await mineBlocks(5, provider);
  expect(await getBlockHeight(provider)).toEqual(8n);
});
