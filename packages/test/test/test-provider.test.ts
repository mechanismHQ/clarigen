import { NativeClarityBinProvider } from '@blockstack/clarity';
import { TestProvider, createClarityBin, tx } from '../src';
import { SimpleContract, simpleInfo } from './contracts/simple';

let contract: SimpleContract;
let provider: NativeClarityBinProvider;

async function deploy() {
  const clarityBin = await createClarityBin();
  const contracts = await TestProvider.fromContracts({ simple: simpleInfo }, clarityBin);
  contract = contracts.simple.contract;
  provider = clarityBin;
}

beforeAll(async () => {
  await deploy();
});

test('can call public function', async () => {
  const result = await tx(contract.getName(), 'ST1ESYCGJB5Z5NBHS39XPC70PGC14WAQK5XXNQYDW');
  if (!result.isOk) throw 'Expected ok';
  expect(result.value).toEqual('hello, world');
});

test('can call a read-only function', async () => {
  const num = await contract.getNumber();
  expect(num).toEqual(1);
});
