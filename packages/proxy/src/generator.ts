import { NativeClarityBinProvider } from '@blockstack/clarity';
import { getTempFilePath } from '@blockstack/clarity/lib/utils/fsUtil';
import { getDefaultBinaryFilePath } from '@blockstack/clarity-native-bin';
import { ClarityAbi } from '@stacks/transactions';
import { basename, extname } from 'path';
import { toCamelCase } from '@clarion/proxy';

const getContractNameFromPath = (path: string) => {
  return basename(path, extname(path));
};

export const generateInterface = async ({
  contractFile,
}: {
  contractFile: string;
}): Promise<ClarityAbi> => {
  const binFile = getDefaultBinaryFilePath();
  const dbFileName = getTempFilePath();
  const provider = await NativeClarityBinProvider.create([], dbFileName, binFile);
  const contractName = getContractNameFromPath(contractFile);
  const receipt = await provider.runCommand([
    'launch',
    `S1G2081040G2081040G2081040G208105NK8PE5.${contractName}`,
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

export const generateInterfaceFile = async ({ contractFile }: { contractFile: string }) => {
  const abi = await generateInterface({ contractFile });
  const contractName = getContractNameFromPath(contractFile);
  const contractCamel = toCamelCase(contractName);
  const variableName = contractCamel[0].toUpperCase() + contractCamel.slice(1);
  const abiString = JSON.stringify(abi, null, 2);
  // console.log(abiString);

  const fileContents = `
import { ClarityAbi } from '@stacks/transactions';

export const ${variableName}: ClarityAbi = ${abiString};
  `;

  return fileContents;
};
