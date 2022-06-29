import { mkdir } from 'fs/promises';
import { relative, resolve } from 'path';
import { SessionContract } from './deno-run';
import { generateMarkdownDoc } from './docs';
import {
  generateTypesFile,
  generateIndexFile,
  generateInterfaceFile,
} from './generate/files';
import { ContractMeta } from './utils';
import { writeFile } from './writer';

export const generateFilesForContractWithSession = async ({
  outputFolder,
  sessionContract,
  dirName,
  docsPath,
  contractFile,
}: {
  outputFolder: string;
  sessionContract: SessionContract;
  dirName?: string;
  docsPath?: string;
  contractFile: string;
}): Promise<ContractMeta> => {
  const contractIdentifier = sessionContract.contract_id;
  const [contractAddress, contractName] = contractIdentifier.split('.');

  const abi = sessionContract.contract_interface;
  const variables = [];

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
