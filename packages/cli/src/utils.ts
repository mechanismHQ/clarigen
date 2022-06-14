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
  deployContract,
} from '@clarigen/native-bin';
import { resolve, relative, dirname } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { getProjectConfig } from './config';
import { generateDocsIndex, generateMarkdownDoc } from './docs';
import { ClarityAbi, Contract } from '@clarigen/core';
import { generateContractMeta, generateSingleFile } from './generate/single';

export interface ContractMeta {
  abi: ClarityAbi;
  contractFile: string;
  dirName: string;
  contractName: string;
}

export const generateFilesForContract = async ({
  contractFile: _contractFile,
  outputFolder,
  provider,
  contractAddress,
  dirName,
  contractName,
  docsPath,
}: {
  contractFile: string;
  outputFolder: string;
  provider: NativeClarityBinProvider;
  contractAddress: string;
  dirName?: string;
  contractName: string;
  docsPath?: string;
}): Promise<ContractMeta> => {
  const contractFile = resolve(process.cwd(), _contractFile);
  const contractIdentifier = `${contractAddress}.${contractName}`;

  const abi = await deployContract({
    contractIdentifier,
    contractFilePath: contractFile,
    provider,
  });
  const typesFile = generateTypesFile(abi, contractName);
  const indexFile = generateIndexFile({
    contractFile: relative(process.cwd(), contractFile),
    contractAddress: contractAddress,
    contractName,
  });
  const abiFile = generateInterfaceFile({ contractName, abi });

  if (typeof docsPath !== 'undefined') {
    await generateMarkdownDoc({
      contractFile,
      contractName,
      abi,
      docsPath,
      dirName,
    });
  }

  const outputPath = resolve(outputFolder, dirName || '.', contractName);
  await mkdir(outputPath, { recursive: true });

  await writeFile(resolve(outputPath, 'abi.ts'), abiFile);
  await writeFile(resolve(outputPath, 'index.ts'), indexFile);
  await writeFile(resolve(outputPath, 'types.ts'), typesFile);

  return {
    abi,
    contractFile,
    contractName,
    dirName,
  };
};

export const generateProject = async (projectPath: string) => {
  const configFile = await getProjectConfig(projectPath);
  const { contractsDir, outputDir, contracts } = configFile;
  const outputFolder = resolve(projectPath, outputDir);
  const provider = await createClarityBin();
  const metas: ContractMeta[] = [];
  // this needs to be serial
  for (const contract of contracts) {
    const contractFile = resolve(projectPath, contractsDir, contract.file);
    const dirName = dirname(contract.file);
    const meta = await generateFilesForContract({
      contractFile,
      outputFolder: outputFolder,
      provider,
      contractAddress: contract.address,
      dirName,
      contractName: contract.name,
      docsPath: configFile.docs,
    });
    metas.push(meta);
  }

  const indexFile = generateProjectIndexFile(configFile);
  await generateDocsIndex(configFile);

  const indexPath = resolve(outputFolder, 'index.ts');
  await writeFile(indexPath, indexFile);

  const singleFile = await generateSingleFile(configFile, metas);
  const singlePath = resolve(outputFolder, 'single.ts');
  await writeFile(singlePath, singleFile);
};
