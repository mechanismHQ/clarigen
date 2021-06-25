import { parse } from '@ltd/j-toml';
import { resolve } from 'path';
import { readFile } from 'fs/promises';
import { ConfigContract } from './config';
import { generateWallet, getStxAddress } from '@stacks/wallet-sdk';

interface ClarinetAccount {
  mnemonic: string;
  balance: bigint;
}

interface ClarinetDevConfig {
  network: {
    name: string;
  };
  accounts: {
    deployer: ClarinetAccount;
    [key: string]: ClarinetAccount;
  };
}

export async function getClarinetDevConfig(
  folder: string
): Promise<ClarinetDevConfig> {
  const baseConfigPath = resolve(folder, 'settings', 'Development.toml');
  const configContents = await readFile(baseConfigPath, { encoding: 'utf-8' });
  const config = (parse(
    configContents,
    1.0,
    '\n',
    false
  ) as unknown) as ClarinetDevConfig;
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
    false
  ) as unknown) as ClarinetConfig;
  return config;
}

export async function getContractsFromClarinet(
  folder: string
): Promise<ConfigContract[]> {
  const clarinetConfig = await getClarinetConfig(folder);
  const devConfig = await getClarinetDevConfig(folder);
  const { deployer } = devConfig.accounts;
  const wallet = await generateWallet({
    secretKey: deployer.mnemonic,
    password: 'password',
  });
  const [account] = wallet.accounts;
  const deployerAddress = getStxAddress({ account });
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
