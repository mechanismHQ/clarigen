import { NativeClarityBinProvider } from '@clarigen/native-bin';
import { TestProvider, createClarityBin, getBlockHeight, mineBlocks, getStxBalance } from '../src';

let provider: NativeClarityBinProvider;
const alice = 'ST1ESYCGJB5Z5NBHS39XPC70PGC14WAQK5XXNQYDW';

const bigBalance = 1000000n * 2100000n * 1000000n;

async function deploy() {
  const clarityBin = await createClarityBin({
    allocations: [{ principal: alice, amount: bigBalance }],
    testnet: true,
  });
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

test('can get balance of user', async () => {
  const balance = await getStxBalance(provider, alice);
  expect(balance).toEqual(bigBalance);
});
