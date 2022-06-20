import { resolve, join, relative } from 'path';
import { readFile, access } from 'fs/promises';
import { constants } from 'fs';
import {
  ClarinetAccounts,
  getClarinetAccounts,
  getClarinetConfig,
  getContractsFromClarinet,
} from './clarinet-config';

export interface ConfigContract {
  address: string;
  file: string;
  name: string;
}

export interface ConfigFileContents {
  outputDir: string;
  clarinet: string;
  docs?: string;
}

export interface ConfigFile extends ConfigFileContents {
  contractsDir: string;
  contracts: ConfigContract[];
  accounts: ClarinetAccounts;
  clarinet: string;
}

export const defaultConfigFile: ConfigFileContents = {
  outputDir: 'src/clarigen',
  clarinet: '.',
};

export function configFilePath(rootPath: string) {
  return resolve(rootPath, 'clarigen.config.json');
}

export async function configFileExists(configPath: string): Promise<boolean> {
  try {
    await access(configPath, constants.R_OK);
    return true;
  } catch (error) {
    return false;
  }
}

export async function getConfigFile(
  rootPath: string
): Promise<ConfigFileContents> {
  const fullPath = configFilePath(rootPath);
  const exists = await configFileExists(fullPath);
  if (exists) {
    const configContents = await readFile(fullPath, { encoding: 'utf-8' });
    const configFile: ConfigFileContents = JSON.parse(configContents);
    return {
      ...defaultConfigFile,
      ...configFile,
    };
  }
  return defaultConfigFile;
}

export async function getProjectConfig(rootPath: string): Promise<ConfigFile> {
  const configFile = await getConfigFile(rootPath);
  const clarinetPath = resolve(rootPath, configFile.clarinet);
  const clarinet = await getClarinetConfig(clarinetPath);
  const accounts = await getClarinetAccounts(clarinetPath);
  const contracts = getContractsFromClarinet(clarinet, accounts);
  const contractsDir = relative(
    process.cwd(),
    join(configFile.clarinet, 'contracts')
  );
  return {
    ...configFile,
    outputDir: clarinet.clarigen.output_dir || configFile.outputDir,
    docs: clarinet.clarigen.docs || configFile.docs,
    contracts,
    contractsDir,
    accounts,
    clarinet: configFile.clarinet,
  };
}
