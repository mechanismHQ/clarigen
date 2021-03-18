import {
  generateIndexFile,
  generateInterface,
  generateInterfaceFile,
  createProvider,
  makeTypes,
  getContractNameFromPath,
} from '@clarion/proxy';
import { NativeClarityBinProvider } from '@blockstack/clarity';
import { resolve } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { getConfigFile } from './config';

export const generateFilesForContract = async ({
  contractFile: _contractFile,
  outputFolder,
  provider,
  contractAddress,
}: {
  contractFile: string;
  outputFolder?: string;
  provider?: NativeClarityBinProvider;
  contractAddress?: string;
}) => {
  const contractFile = resolve(process.cwd(), _contractFile);
  const contractName = getContractNameFromPath(contractFile);

  const abi = await generateInterface({
    contractFile,
    provider,
    contractAddress,
  });
  const typesFile = makeTypes(abi, contractName);
  const indexFile = generateIndexFile({ contractFile });
  const abiFile = generateInterfaceFile({ contractFile, abi });

  const baseDir = outputFolder || resolve(process.cwd(), `tmp/${contractName}`);
  const outputPath = resolve(baseDir, contractName);
  await mkdir(outputPath, { recursive: true });

  await writeFile(resolve(outputPath, 'abi.ts'), abiFile);
  await writeFile(resolve(outputPath, 'index.ts'), indexFile);
  await writeFile(resolve(outputPath, 'types.ts'), typesFile);
};

export const generateProject = async (projectPath: string) => {
  const configFile = await getConfigFile(projectPath);
  const { contractsDir, outputDir, contracts } = configFile;
  const outputFolder = resolve(projectPath, outputDir);
  const provider = await createProvider();
  // this needs to be serial
  for (const contract of contracts) {
    const contractFile = resolve(projectPath, contractsDir, contract.file);
    await generateFilesForContract({
      contractFile,
      outputFolder: outputFolder,
      provider,
      contractAddress: contract.address,
    });
  }
};
