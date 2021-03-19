import { NativeClarityBinProvider } from '@blockstack/clarity';
import { getTempFilePath } from '@blockstack/clarity/lib/utils/fsUtil';
import { getDefaultBinaryFilePath } from '@blockstack/clarity-native-bin';
import { ClarityAbi } from './clarity-types';
import { basename, extname } from 'path';
import { toCamelCase } from './utils';
import { makeTypes } from './declaration';

export const getContractNameFromPath = (path: string) => {
  return basename(path, extname(path));
};

export const generateInterface = async ({
  provider: _provider,
  contractFile,
  contractAddress = 'S1G2081040G2081040G2081040G208105NK8PE5',
}: {
  contractFile: string;
  provider?: NativeClarityBinProvider;
  contractAddress?: string;
}): Promise<ClarityAbi> => {
  const binFile = getDefaultBinaryFilePath();
  const dbFileName = getTempFilePath();
  const provider = _provider || (await NativeClarityBinProvider.create([], dbFileName, binFile));
  const contractName = getContractNameFromPath(contractFile);
  const receipt = await provider.runCommand([
    'launch',
    `${contractAddress}.${contractName}`,
    contractFile,
    provider.dbFilePath,
    '--output_analysis',
  ]);
  if (receipt.stderr) {
    throw new Error(receipt.stderr);
  }
  const abi = JSON.parse(receipt.stdout);
  return abi;
};

export const generateInterfaceFile = ({
  contractFile,
  abi,
}: {
  contractFile: string;
  abi: ClarityAbi;
}) => {
  const contractName = getContractNameFromPath(contractFile);
  const variableName = toCamelCase(contractName, true);
  const abiString = JSON.stringify(abi, null, 2);

  const fileContents = `import { ClarityAbi } from '@clarion/proxy';

// prettier-ignore
export const ${variableName}Interface: ClarityAbi = ${abiString};
`;

  return fileContents;
};

export const generateIndexFile = ({ contractFile }: { contractFile: string }) => {
  const contractName = getContractNameFromPath(contractFile);
  const contractTitle = toCamelCase(contractName, true);
  const varName = toCamelCase(contractName);

  const fileContents = `import { proxy, TestProvider } from '@clarion/proxy';
import type { ${contractTitle}Contract } from './types';
import { ${contractTitle}Interface } from './abi';

export const ${varName}Contract = (provider: TestProvider) => {
  const contract = proxy<${contractTitle}Contract>(${contractTitle}Interface, provider);
  return contract;
};
`;

  return fileContents;
};

export const generateTypesFile = (abi: ClarityAbi, contractName: string) => {
  const name = toCamelCase(contractName, true);
  const typings = makeTypes(abi);
  const fileContents = `import { ClarityTypes, Transaction } from '@clarion/proxy';

export interface ${name}Contract {
${typings}
}
`;

  return fileContents;
};
