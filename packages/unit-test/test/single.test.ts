/**
 * @jest-environment <rootDir>/test/environment.ts
 */
import { contractFactory } from '@clarigen/core';
import { contracts, accounts } from './clarinet-project/clarigen/single';

const factory = contractFactory(contracts, accounts.deployer.address);
const contract = factory.tester;
const alice = accounts.wallet_1.address;

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
