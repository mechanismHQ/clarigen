import {
  generateIndexFile,
  generateInterface,
  generateInterfaceFile,
  makeTypes,
  getContractNameFromPath,
} from '@clarion/proxy';
import { resolve } from 'path';
import { mkdir, writeFile } from 'fs/promises';

export const generateFilesForContract = async ({
  contractFile: _contractFile,
  outputFolder,
}: {
  contractFile: string;
  outputFolder?: string;
}) => {
  const contractFile = resolve(process.cwd(), _contractFile);
  const contractName = getContractNameFromPath(contractFile);

  const abi = await generateInterface({ contractFile });
  const typesFile = makeTypes(abi, contractName);
  const indexFile = generateIndexFile({ contractFile });
  const abiFile = generateInterfaceFile({ contractFile, abi });

  const outputPath =
    outputFolder || resolve(process.cwd(), `tmp/${contractName}`);
  await mkdir(outputPath, { recursive: true });

  await writeFile(resolve(outputPath, 'abi.ts'), abiFile);
  await writeFile(resolve(outputPath, 'index.ts'), indexFile);
  await writeFile(resolve(outputPath, 'types.ts'), typesFile);
};
