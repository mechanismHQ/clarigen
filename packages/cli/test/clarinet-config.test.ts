import {
  getClarinetAccounts,
  getClarinetConfig,
  getClarinetDevConfig,
  getContractsFromClarinet,
} from '../src/clarinet-config';
import { resolve } from 'path';

test('can get development config', async () => {
  const path = resolve(process.cwd(), 'test/clarinet-project/clarinet');
  const config = await getClarinetDevConfig(path);
  const { network, accounts } = config;
  expect(accounts.deployer.balance).toEqual(1000000000000000000000n);
  expect(accounts.deployer.mnemonic).toEqual(
    'fetch outside black test wash cover just actual execute nice door want airport betray quantum stamp fish act pen trust portion fatigue scissors vague'
  );
  expect(network.name).toEqual('Development');
});

test('can get base config', async () => {
  const path = resolve(process.cwd(), 'test/clarinet-project/clarinet');
  const config = await getClarinetConfig(path);
  const { echo } = config.contracts;
  expect(echo.path).toEqual('contracts/echo.clar');
});

test('getting contracts from clarinet', async () => {
  const path = resolve(process.cwd(), 'test/clarinet-project/clarinet');
  const accounts = await getClarinetAccounts(path);
  const contracts = await getContractsFromClarinet(path, accounts);
  const [echo, nested] = contracts;
  expect(echo.address).toEqual('ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE');
  expect(echo.file).toEqual('echo.clar');

  expect(nested.file).toEqual('nested/nested.clar');
}, 10000);
