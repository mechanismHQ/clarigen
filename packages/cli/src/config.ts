import { resolve, join, relative } from 'path';
import { readFile } from 'fs/promises';
import { getContractsFromClarinet } from './clarinet-config';

export interface ConfigContract {
  address: string;
  file: string;
}

export interface ConfigFileBase {
  outputDir: string;
}

export interface ConfigFileWithClarinet extends ConfigFileBase {
  clarinet: string;
}

export interface ConfigFileRegular extends ConfigFileBase {
  contractsDir: string;
  contracts: ConfigContract[];
}

export type ConfigFileContents = ConfigFileRegular | ConfigFileWithClarinet;

export type ConfigFile = ConfigFileRegular & {
  clarinet?: string;
};

export async function getConfigFile(rootPath: string): Promise<ConfigFile> {
  const fullPath = resolve(rootPath, 'clarigen.config.json');
  const configContents = await readFile(fullPath, { encoding: 'utf-8' });
  const configFile: ConfigFileContents = JSON.parse(configContents);
  if (!configFile.outputDir) throw new Error('Config file missing "outputDir"');
  if ('clarinet' in configFile) {
    const clarinetPath = resolve(rootPath, configFile.clarinet);
    const contracts = await getContractsFromClarinet(clarinetPath);
    const contractsDir = relative(
      process.cwd(),
      join(configFile.clarinet, 'contracts')
    );
    return {
      ...configFile,
      contracts,
      contractsDir,
    };
  }
  if (!configFile.contracts) throw new Error('Config file missing "contracts"');
  if (!configFile.contractsDir)
    throw new Error('Config file missing "contractDir"');
  return configFile;
}
