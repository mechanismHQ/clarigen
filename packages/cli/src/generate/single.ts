import { toCamelCase } from '@clarigen/core';
import type { ConfigFile } from '../config';
import { getArgName, jsTypeFromAbiType } from './declaration';
import type { ContractMeta } from '../utils';
import { relative, resolve } from 'path';
import { readFile } from 'fs/promises';
import { inspect } from 'util';

export function generateContractMeta(contract: ContractMeta) {
  const { abi } = contract;
  const functionLines: string[] = [];
  const { functions, variables, maps, ...rest } = abi;
  functions.forEach((func) => {
    let functionLine = `${toCamelCase(func.name)}: `;
    const args = func.args.map((arg) => {
      return `${getArgName(arg.name)}: ${jsTypeFromAbiType(arg.type, true)}`;
    });
    const argsTuple = `[${args.join(', ')}]`;
    const funcDef = JSON.stringify(func);
    functionLine += funcDef;
    const retType = jsTypeFromAbiType(func.outputs.type);
    functionLine += ` as TypedAbiFunction<${argsTuple}, ${retType}>`;
    functionLines.push(functionLine);
  });

  const variableLines = contract.variables.map((v) => {
    let varLine = `${toCamelCase(v.name)}: `;
    const type = jsTypeFromAbiType(v.type);
    const varJSON = inspect(v, false, null, false);
    varLine += `${varJSON} as TypedAbiVariable<${type}>`;
    return varLine;
  });

  const constants = contract.variables.filter((v) => v.access === 'constant');
  const constantLines = constants.map((constant) => {
    return `"${toCamelCase(constant.name)}": ${serialize(
      constant.defaultValue
    )}`;
  });

  const mapLines = maps.map((map) => {
    let mapLine = `${toCamelCase(map.name)}: `;
    const keyType = jsTypeFromAbiType(map.key);
    const valType = jsTypeFromAbiType(map.value);
    mapLine += JSON.stringify(map);
    mapLine += ` as TypedAbiMap<${keyType}, ${valType}>`;
    return mapLine;
  });

  const otherAbi = JSON.stringify(rest);

  const contractFile = relative(process.cwd(), contract.contractFile);

  return `{
  ${serializeLines('functions', functionLines)}
  ${serializeLines('variables', variableLines)}
  ${serializeLines('maps', mapLines)}
  ${serializeLines('constants', constantLines)}
  ${otherAbi.slice(1, -1)},
  contractName: '${contract.contractName}',
  contractFile: '${contractFile}',
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
  const accounts = generateAccounts(config);

  const file = `
${types}

export const contracts: Record<string, TypedAbi> = {
  ${contractDefs.join(',\n')}
} as const;

${accounts}
`;
  return file;
}

function generateAccounts(config: ConfigFile) {
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

    accounts = `export const accounts = {
  ${accountLines.join('\n  ')}
} as const;`;
  }
  return accounts;
}

Uint8Array.prototype[inspect.custom] = function (this: Uint8Array) {
  return `Uint8Array.from([${this.join(',')}])`;
};

function serialize(obj: any) {
  return inspect(obj, false, null, false);
}

function serializeLines(key: string, lines: string[]) {
  return `"${key}": {
    ${lines.join(',\n    ')}
  },`;
}

export async function getSingleTypes() {
  // 🤔 weird stuff with tsup shims
  const typesPath = resolve(__dirname, '../../dist/abi-types.ts.txt');
  const typesFile = await readFile(typesPath, { encoding: 'utf-8' });
  return typesFile;
}
