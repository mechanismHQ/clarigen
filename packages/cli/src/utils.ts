import {
  generateIndexFile,
  generateInterface,
  generateInterfaceFile,
  generateProjectIndexFile,
  generateTypesFile,
} from './generate/files';
import {
  NativeClarityBinProvider,
  createClarityBin,
} from '@clarigen/native-bin';
import { resolve, relative, dirname } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { getProjectConfig } from './config';

export const generateFilesForContract = async ({
  contractFile: _contractFile,
  outputFolder,
  provider,
  contractAddress,
  dirName,
  contractName,
}: {
  contractFile: string;
  outputFolder: string;
  provider: NativeClarityBinProvider;
  contractAddress: string;
  dirName?: string;
  contractName: string;
}) => {
  const contractFile = resolve(process.cwd(), _contractFile);

  const abi = await generateInterface({
    contractFile,
    provider,
    contractAddress,
    contractName,
  });
  const typesFile = generateTypesFile(abi, contractName);
  const indexFile = generateIndexFile({
    contractFile: relative(process.cwd(), contractFile),
    contractAddress: contractAddress,
    contractName,
  });
  const abiFile = generateInterfaceFile({ contractName, abi });

  const outputPath = resolve(outputFolder, dirName || '.', contractName);
  await mkdir(outputPath, { recursive: true });

  await writeFile(resolve(outputPath, 'abi.ts'), abiFile);
  await writeFile(resolve(outputPath, 'index.ts'), indexFile);
  await writeFile(resolve(outputPath, 'types.ts'), typesFile);
};

export const generateProject = async (projectPath: string) => {
  const configFile = await getProjectConfig(projectPath);
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
      contractName: contract.name,
    });
  }

  const indexFile = generateProjectIndexFile(configFile);

  const indexPath = resolve(outputFolder, 'index.ts');
  await writeFile(indexPath, indexFile);
};
