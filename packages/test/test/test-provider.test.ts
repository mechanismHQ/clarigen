import { TestProvider } from '../src';
import { contracts, TesterContract, accounts } from './clarinet-project/clarigen';
import { ok } from 'neverthrow';

let contract: TesterContract;
let t: TestProvider;

const alice = accounts.deployer.address;

beforeAll(async () => {
  const { deployed, provider } = await TestProvider.fromContracts(contracts);
  contract = deployed.tester.contract;
  t = provider;
});

test('can call read-only fn', async () => {
  const result = await t.ro(contract.echo('asdf'));
  expect(result.value).toEqual('asdf');

  expect(await t.rov(contract.echo('asdf'))).toEqual('asdf');
});

test('can get logs of ro fn', async () => {
  const result = await t.ro(contract.echoWithLogs('asdf'));
  expect(result.logs[0]).toEqual('"asdf"');
});

test('can call public fn', async () => {
  const result = await t.tx(contract.printPub(), alice);
  expect(result.value).toEqual(true);
});

test('can get parsed prints of public fn', async () => {
  const result = await t.txOk(contract.printPub(), alice);
  const { prints } = result;
  expect(prints[0]).toEqual(32n);
  expect(prints[1]).toEqual({ a: true });
  expect(prints[2]).toEqual('hello');
  expect(result.value).toEqual(true);
});

test('can get an error from public fn', async () => {
  const result = await t.txErr(contract.printErr(), alice);
  expect(result.logs[0]).toEqual('u100');
  expect(result.value).toEqual(210n);
});

describe('read-only with response', () => {
  test('can get response from read-only', async () => {
    const result = await t.ro(contract.roResp(false));
    expect(result.value).toEqual(ok('asdf'));
  });

  test('can get ok response ', async () => {
    const result = await t.roOk(contract.roResp(false));
    expect(result.value).toEqual('asdf');

    expect(await t.rovOk(contract.roResp(false))).toEqual('asdf');
  });

  test('can get err response', async () => {
    const result = await t.roErr(contract.roResp(true));
    expect(result.value).toEqual(100n);

    expect(await t.rovErr(contract.roResp(true))).toEqual(100n);
  });
});
