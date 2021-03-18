import { resolve } from 'path';
import { readFile } from 'fs/promises';

export interface ConfigContract {
  address: string;
  file: string;
}

export interface ConfigFile {
  contractsDir: string;
  outputDir: string;
  contracts: ConfigContract[];
}

export async function getConfigFile(rootPath: string) {
  const fullPath = resolve(rootPath, 'clarion.config.json');
  const configContents = await readFile(fullPath, { encoding: 'utf-8' });
  const configFile: ConfigFile = JSON.parse(configContents);
  if (!configFile.contracts) throw new Error('Config file missing "contracts"');
  if (!configFile.outputDir) throw new Error('Config file missing "outputDir"');
  if (!configFile.contractsDir)
    throw new Error('Config file missing "contractDir"');
  configFile.contracts;
  return configFile;
}
