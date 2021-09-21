import { parse } from '@ltd/j-toml';
import { resolve } from 'path';
import { readFile } from 'fs/promises';
import { ConfigContract } from './config';
import { generateWallet, getStxAddress } from '@stacks/wallet-sdk';

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

interface ClarinetConfig {
  contracts: {
    [name: string]: {
      path: string;
      dependsOn: string[];
    };
  };
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
  const contracts: ConfigContract[] = Object.entries(
    clarinetConfig.contracts
  ).map(([contractName, info]) => {
    const file = info.path.replace(/^contracts\//, '');
    return {
      file,
      address: deployerAddress,
    };
  });
  return contracts;
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
