import {
  generateIndexFile,
  generateInterface,
  generateInterfaceFile,
  generateProjectIndexFile,
  generateTypesFile,
} from './generate/files';
import { getContractNameFromPath } from '@clarigen/core';
import { NativeClarityBinProvider } from '@blockstack/clarity';
import { getTempFilePath } from '@blockstack/clarity/lib/utils/fsUtil';
import { getDefaultBinaryFilePath } from '@blockstack/clarity-native-bin';
import { resolve, relative, dirname } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { getConfigFile } from './config';

export const createClarityBin = async () => {
  const binFile = getDefaultBinaryFilePath();
  const dbFileName = getTempFilePath();
  const provider = new NativeClarityBinProvider([], dbFileName, binFile);
  // TODO: allow testnet/mainnet flag
  const args = ['initialize', '-', dbFileName, '--testnet'];
  await provider.runCommand(args, {
    stdin: JSON.stringify([]),
  });
  return provider;
};

export const generateFilesForContract = async ({
  contractFile: _contractFile,
  outputFolder,
  provider,
  contractAddress,
  dirName,
}: {
  contractFile: string;
  outputFolder?: string;
  provider?: NativeClarityBinProvider;
  contractAddress?: string;
  dirName?: string;
}) => {
  const contractFile = resolve(process.cwd(), _contractFile);
  const contractName = getContractNameFromPath(contractFile);

  const abi = await generateInterface({
    contractFile,
    provider,
    contractAddress,
  });
  const typesFile = generateTypesFile(abi, contractName);
  if (!contractAddress && process.env.NODE_ENV !== 'test') {
    console.warn('Please provide an address with every contract.');
  }
  const indexFile = generateIndexFile({
    contractFile: relative(process.cwd(), contractFile),
    address: contractAddress || '',
  });
  const abiFile = generateInterfaceFile({ contractFile, abi });

  const baseDir = outputFolder || resolve(process.cwd(), `tmp/${contractName}`);
  const outputPath = resolve(baseDir, dirName || '.', contractName);
  await mkdir(outputPath, { recursive: true });

  await writeFile(resolve(outputPath, 'abi.ts'), abiFile);
  await writeFile(resolve(outputPath, 'index.ts'), indexFile);
  await writeFile(resolve(outputPath, 'types.ts'), typesFile);
};

export const generateProject = async (projectPath: string) => {
  const configFile = await getConfigFile(projectPath);
  const { contractsDir, outputDir, contracts } = configFile;
  const outputFolder = resolve(projectPath, outputDir);
  const provider = await createClarityBin();
  // this needs to be serial
  for (const contract of contracts) {
    const contractFile = resolve(projectPath, contractsDir, contract.file);
    const dirName = dirname(contract.file);
    await generateFilesForContract({
      contractFile,
      outputFolder: outputFolder,
      provider,
      contractAddress: contract.address,
      dirName,
    });
  }

  const indexFile = generateProjectIndexFile(configFile);

  const indexPath = resolve(outputFolder, 'index.ts');
  await writeFile(indexPath, indexFile);
};
