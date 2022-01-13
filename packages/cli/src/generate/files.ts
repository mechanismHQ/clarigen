import { NativeClarityBinProvider, hasStdErr } from '@clarigen/native-bin';
import { ClarityAbi, toCamelCase } from '@clarigen/core';
import { makeTypes } from './declaration';
import { ConfigContract, ConfigFile } from '../config';
import { dirname, resolve, join } from 'path';

export const generateInterface = async ({
  provider,
  contractFile,
  contractAddress,
  contractName,
}: {
  contractFile: string;
  provider: NativeClarityBinProvider;
  contractAddress: string;
  contractName: string;
}): Promise<ClarityAbi> => {
  const receipt = await provider.runCommand([
    'launch',
    `${contractAddress}.${contractName}`,
    contractFile,
    provider.dbFilePath,
    '--output_analysis',
    '--costs',
    '--assets',
  ]);
  if (hasStdErr(receipt.stderr)) {
    throw new Error(`Error on ${contractFile}:
  ${receipt.stderr}
    `);
  }
  const output = JSON.parse(receipt.stdout);
  if (output.error) {
    const { initialization } = output.error;
    if (initialization?.includes('\nNear:\n')) {
      const [error, trace] = initialization.split('\nNear:\n');
      let startLine = '';
      const matcher = /start_line: (\d+),/;
      const matches = matcher.exec(trace);
      if (matches) startLine = matches[1];
      throw new Error(`Error on ${contractFile}:
    ${error}
    ${startLine ? `Near line ${startLine}` : ''}
    Raw trace:
    ${trace}
      `);
    }
    throw new Error(`Error on ${contractFile}:
  ${JSON.stringify(output.error, null, 2)}
    `);
  }
  const abi = output.analysis;
  return abi;
};

export const generateInterfaceFile = ({
  contractName,
  abi,
}: {
  contractName: string;
  abi: ClarityAbi;
}) => {
  const variableName = toCamelCase(contractName, true);
  const { clarity_version, ...rest } = abi;
  const abiString = JSON.stringify(rest, null, 2);

  const fileContents = `import { ClarityAbi } from '@clarigen/core';

// prettier-ignore
export const ${variableName}Interface: ClarityAbi = ${abiString};
`;

  return fileContents;
};

export const generateIndexFile = ({
  contractFile,
  contractAddress,
  contractName,
}: {
  contractFile: string;
  contractAddress: string;
  contractName: string;
}) => {
  const contractTitle = toCamelCase(contractName, true);
  const varName = toCamelCase(contractName);
  const contractType = `${contractTitle}Contract`;

  const fileContents = `import { proxy, BaseProvider, Contract } from '@clarigen/core';
import type { ${contractType} } from './types';
import { ${contractTitle}Interface } from './abi';
export type { ${contractType} } from './types';

export const ${varName}Contract = (provider: BaseProvider) => {
  const contract = proxy<${contractType}>(${contractTitle}Interface, provider);
  return contract;
};

export const ${varName}Info: Contract<${contractType}> = {
  contract: ${varName}Contract,
  address: '${contractAddress}',
  contractFile: '${contractFile}',
  name: '${contractName}',
};
`;

  return fileContents;
};

export const generateTypesFile = (abi: ClarityAbi, contractName: string) => {
  const name = toCamelCase(contractName, true);
  const typings = makeTypes(abi);
  const fileContents = `import { ClarityTypes, Transaction } from '@clarigen/core';

// prettier-ignore
export interface ${name}Contract {
${typings}
}
`;

  return fileContents;
};

export const generateProjectIndexFile = (config: ConfigFile) => {
  const imports: string[] = [];
  const exports: string[] = [];
  const contractMap: string[] = [];

  let accounts = '';
  if ('accounts' in config) {
    const accountLines = Object.keys(config.accounts).map((key) => {
      const account = config.accounts[key];
      return `"${key}": {
    mnemonic: "${account.mnemonic}",
    balance: ${account.balance.toString()}n,
    address: "${account.address}",
  },`;
    });

    accounts = `\n\n// prettier-ignore
export const accounts = {
  ${accountLines.join('\n  ')}
};`;
  }

  config.contracts.forEach((contract) => {
    const contractName = contract.name;
    const contractVar = toCamelCase(contractName);
    const contractInfo = `${contractVar}Info`;
    const contractInterface = `${toCamelCase(contractName, true)}Contract`;
    const dirName = dirname(contract.file);
    const importPath = `'./${join(dirName || '.', contractName)}'`;

    const _import = `import { ${contractInfo} } from ${importPath};`;
    imports.push(_import);

    const _export = `export type { ${contractInterface} } from ${importPath};`;
    exports.push(_export);

    const map = `${contractVar}: ${contractInfo},`;
    contractMap.push(map);
  });

  const file = `${imports.join('\n')}
${exports.join('\n')}

export const contracts = {
  ${contractMap.join('\n  ')}
};${accounts}
`;
  return file;
};
