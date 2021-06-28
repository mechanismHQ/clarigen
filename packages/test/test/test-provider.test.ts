import { NativeClarityBinProvider } from '@blockstack/clarity';
import { TestProvider, createClarityBin, tx } from '../src';
import { FuzzerContract, fuzzerInfo } from './contracts/fuzzer';

let contract: FuzzerContract;
let provider: NativeClarityBinProvider;

async function deploy() {
  const clarityBin = await createClarityBin();
  const contracts = await TestProvider.fromContracts({
    fuzzer: {
      ...fuzzerInfo,
      contractFile: 'test/contracts/fuzzer/fuzzer.clar',
    },
  });
  contract = contracts.fuzzer.contract;
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

test('can call a variable', async () => {
  const constant = await contract.ERR_SOMETHING();
  expect(constant).toEqual(2);

  const variable = await contract.myVar();
  expect(variable).toEqual(1);
});

test('can call a map', async () => {
  const mapVal = await contract.basicMap(1);
  expect(mapVal).toEqual(null);
});

test('can call a read-only function', async () => {
  const num = await contract.getNumber();
  expect(num).toEqual(1);
});
