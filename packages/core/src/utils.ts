import { contractPrincipalCV, ContractPrincipalCV } from 'micro-stacks/clarity';
import { Contract } from './types';

export const TESTNET_BURN_ADDRESS = 'ST000000000000000000002AMW42H';
export const MAINNET_BURN_ADDRESS = 'SP000000000000000000002Q6VF78';

export const toCamelCase = (input: string | number | symbol, titleCase?: boolean) => {
  const inputStr = typeof input === 'string' ? input : String(input);
  // Check if the input string only contains uppercase letters and/or underscores
  const isUpperCaseAndUnderscore = /^[A-Z_]+$/.test(inputStr);
  if (isUpperCaseAndUnderscore) {
    return inputStr;
  }
  const [first, ...parts] = inputStr.replace('!', '').replace('?', '').split('-');
  const firstChar = titleCase ? first[0].toUpperCase() : first[0].toLowerCase();
  let result = `${firstChar}${first.slice(1)}`;
  parts.forEach(part => {
    const capitalized = part[0].toUpperCase() + part.slice(1);
    result += capitalized;
  });
  return result;
};

export function toKebabCase(input: string): string {
  const matches = input.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);
  if (!matches) return input;
  return matches.join('-').toLowerCase();
}

export const getContractNameFromPath = (path: string) => {
  const contractPaths = path.split('/');
  const filename = contractPaths[contractPaths.length - 1];
  const [contractName] = filename.split('.');
  return contractName;
};

export const getContractIdentifier = <T>(contract: Contract<T>) => {
  return `${contract.address}.${contract.name}`;
};

export const getContractPrincipalCV = <T>(contract: Contract<T>): ContractPrincipalCV => {
  const contractName = getContractNameFromPath(contract.contractFile);
  return contractPrincipalCV(contract.address, contractName);
};

export function bootContractIdentifier(name: string, mainnet: boolean) {
  const addr = mainnet ? MAINNET_BURN_ADDRESS : TESTNET_BURN_ADDRESS;
  return `${addr}.${name}`;
}
