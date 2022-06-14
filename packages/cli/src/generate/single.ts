import { ClarityAbi, toCamelCase } from '@clarigen/core';
import { createClarityBin } from '@clarigen/native-bin';
import { ConfigFile } from '../config';
import { getArgName, jsTypeFromAbiType } from './declaration';
import type { ContractMeta } from '../utils';
import { resolveConfig, format } from 'prettier';
import { resolve } from 'path';
import { readFile } from 'fs/promises';

export function generateContractMeta(contract: ContractMeta) {
  const { abi } = contract;
  const functionLines: string[] = [];
  abi.functions.forEach((func) => {
    let functionLine = `${toCamelCase(func.name)}: `;
    const args = func.args.map((arg) => {
      return `${getArgName(arg.name)}: ${jsTypeFromAbiType(arg.type, true)}`;
    });
    const argsTuple = `[${args.join(', ')}]`;
    const funcDef = JSON.stringify(func);
    functionLine += funcDef;
    const retType = jsTypeFromAbiType(func.outputs.type);
    functionLine += ` as SpecialFn<${argsTuple}, ${retType}>`;
    functionLines.push(functionLine);
  });

  return `{
  functions: {
    ${functionLines.join(',\n    ')}
  },
  contractName: '${contract.contractName}',
  contractFile: '${contract.contractFile}',
}`;
}

export async function generateSingleFile(
  config: ConfigFile,
  contracts: ContractMeta[]
) {
  const contractDefs = contracts.map((contract) => {
    const meta = generateContractMeta(contract);
    const keyName = toCamelCase(contract.contractName);
    return `${keyName}: ${meta}`;
  });

  const types = await getSingleTypes();

  const file = `
${types}

export const contracts = {
  ${contractDefs.join(',\n')}
} as const;
`;

  const prettierConfig = await resolveConfig(process.cwd());
  console.log('prettierConfig', prettierConfig);
  const formatted = format(file, {
    ...prettierConfig,
    filepath: 'single.ts',
  });

  return formatted;
}

export async function getSingleTypes() {
  const typesPath = resolve(__dirname, '../../../core/src/abi-types.ts');
  const typesFile = await readFile(typesPath, { encoding: 'utf-8' });
  return typesFile;
}
