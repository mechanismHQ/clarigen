import {
  generateIndexFile,
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
import { mkdir } from 'fs/promises';
import { getProjectConfig } from './config';
import { generateDocsIndex, generateMarkdownDoc } from './docs';
import { ClarityAbi, Contract } from '@clarigen/core';
import { generateContractMeta, generateSingleFile } from './generate/single';
import { writeFile } from './writer';
import { getVariables, TypedAbiVariable } from './generate/vars';
import { ClarityAbiVariable } from 'micro-stacks/clarity';
import { generateDeployments } from './generate/deployment';
import { getClarinetSession } from './deno-run';
import { generateFilesForContractWithSession } from './contract';

export interface ContractMeta {
  abi: ClarityAbi;
  contractFile: string;
  dirName: string;
  contractName: string;
  contractAddress: string;
  variables: TypedAbiVariable<unknown>[];
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
  const variables = await getVariables({
    abi,
    contractIdentifier,
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
    contractAddress,
    variables,
  };
};

export const generateProject = async (projectPath: string) => {
  const configFile = await getProjectConfig(projectPath);
  const { contractsDir, outputDir, contracts } = configFile;
  const outputFolder = resolve(projectPath, outputDir);
  const provider = await createClarityBin();
  const metas: ContractMeta[] = [];
  const session = await getClarinetSession(
    resolve(projectPath, configFile.clarinet)
  );
  // this needs to be serial
  for (const contract of session.contracts) {
    const configContract = contracts.find(
      (c) => c.name === contract.contract_id.split('.')[1]
    );
    if (typeof configContract === 'undefined') {
      throw new Error(`No config contract found for ${contract.contract_id}`);
    }
    const contractFile = resolve(
      projectPath,
      configFile.clarinet,
      configContract.file
    );
    const meta = await generateFilesForContractWithSession({
      sessionContract: contract,
      outputFolder,
      docsPath: configFile.docs,
      contractFile,
      legacy: configFile.legacy,
    });
    metas.push(meta);
  }

  await generateDocsIndex(configFile);

  if (configFile.legacy) {
    const indexFile = generateProjectIndexFile(configFile);
    const indexPath = resolve(outputFolder, 'index.ts');
    await writeFile(indexPath, indexFile);
  }

  const singleFile = await generateSingleFile(configFile, metas);
  const singlePath = resolve(outputFolder, 'single.ts');
  await writeFile(singlePath, singleFile);
  await generateDeployments(configFile);
};
