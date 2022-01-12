import { parse } from '@ltd/j-toml';
import { resolve } from 'path';
import { readFile } from 'fs/promises';
import { ConfigContract } from './config';
import { generateWallet, getStxAddress } from '@stacks/wallet-sdk';
import { array as toposort } from 'toposort';

interface ClarinetConfigAccount {
  mnemonic: string;
  balance: bigint;
}

interface ClarinetDevConfig {
  network: {
    name: string;
  };
  accounts: {
    deployer: ClarinetConfigAccount;
    [key: string]: ClarinetConfigAccount;
  };
}

export async function getClarinetDevConfig(
  folder: string
): Promise<ClarinetDevConfig> {
  const baseConfigPath = resolve(folder, 'settings', 'Devnet.toml');
  const configContents = await readFile(baseConfigPath, { encoding: 'utf-8' });
  const config = (parse(configContents, 1.0, '\n', true, {
    longer: true,
  }) as unknown) as ClarinetDevConfig;
  return config;
}

export interface ClarinetContract {
  path: string;
  depends_on: string[];
}

export interface ClarinetContracts {
  [name: string]: ClarinetContract;
}

export interface ClarinetConfig {
  contracts: ClarinetContracts;
}

export async function getClarinetConfig(folder: string) {
  const baseConfigPath = resolve(folder, 'Clarinet.toml');
  const configContents = await readFile(baseConfigPath, { encoding: 'utf-8' });
  const config = (parse(
    configContents,
    1.0,
    '\n',
    true
  ) as unknown) as ClarinetConfig;
  return config;
}

export async function getContractsFromClarinet(
  folder: string,
  accounts: ClarinetAccounts
): Promise<ConfigContract[]> {
  const clarinetConfig = await getClarinetConfig(folder);
  const deployerAddress = accounts.deployer.address;
  const sortedContracts = sortClarinetContracts(clarinetConfig.contracts);
  const contracts: ConfigContract[] = sortedContracts.map(contractName => {
    const info = clarinetConfig.contracts[contractName];
    const file = info.path.replace(/^contracts\//, '');
    return {
      file,
      address: deployerAddress,
    };
  })
  return contracts;
}

export function sortClarinetContracts(contractsConfig: ClarinetContracts) {
  const edges: [string, string][] = [];
  const nodes: string[] = [];
  Object.entries(contractsConfig).forEach(([contractName, info]) => {
    nodes.push(contractName);
    info.depends_on.forEach((dependency) =>
      edges.push([contractName, dependency])
    );
  });
  const sorted = toposort(nodes, edges).reverse();
  return sorted;
}

export interface ClarinetAccount extends ClarinetConfigAccount {
  address: string;
}

export interface ClarinetAccounts {
  deployer: ClarinetAccount;
  [name: string]: ClarinetAccount;
}

export async function getClarinetAccounts(
  folder: string
): Promise<ClarinetAccounts> {
  const devConfig = await getClarinetDevConfig(folder);
  const accountEntries = await Promise.all(
    Object.entries(devConfig.accounts).map(async ([key, info]) => {
      const wallet = await generateWallet({
        secretKey: info.mnemonic,
        password: 'password',
      });
      const [account] = wallet.accounts;
      const address = getStxAddress({ account });
      return [
        key,
        {
          ...info,
          address,
        },
      ];
    })
  );
  const accounts: ClarinetAccounts = Object.fromEntries(accountEntries);
  return accounts;
}
