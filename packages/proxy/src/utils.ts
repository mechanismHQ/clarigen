import { contractPrincipalCV } from '@stacks/transactions';
import { basename, extname } from 'path';
import { Contract } from './types';

export const toCamelCase = (input: string | number | symbol, titleCase?: boolean) => {
  const inputStr = typeof input === 'string' ? input : String(input);
  const [first, ...parts] = inputStr.replace('!', '').split('-');
  let result = titleCase ? `${first[0].toUpperCase()}${first.slice(1)}` : first;
  parts.forEach(part => {
    const capitalized = part[0].toUpperCase() + part.slice(1);
    result += capitalized;
  });
  return result;
};

export const getContractNameFromPath = (path: string) => {
  return basename(path, extname(path));
};

export const getContractIdentifier = <T>(contract: Contract<T>) => {
  const contractName = getContractNameFromPath(contract.contractFile);
  return `${contract.address}.${contractName}`;
};

export const getContractPrincipalCV = <T>(contract: Contract<T>) => {
  const contractName = getContractNameFromPath(contract.contractFile);
  return contractPrincipalCV(contract.address, contractName);
};
