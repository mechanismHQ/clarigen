import { contractPrincipalCV, ContractPrincipalCV } from 'micro-stacks/clarity';
import { Contract } from './types';

export const TESTNET_BURN_ADDRESS = 'ST000000000000000000002AMW42H';
export const MAINNET_BURN_ADDRESS = 'SP000000000000000000002Q6VF78';

export const toCamelCase = (input: string | number | symbol, titleCase?: boolean) => {
  const inputStr = typeof input === 'string' ? input : String(input);
  const [first, ...parts] = inputStr.replace('!', '').replace('?', '').split('-');
  let result = titleCase ? `${first[0].toUpperCase()}${first.slice(1)}` : first;
  parts.forEach(part => {
    const capitalized = part[0].toUpperCase() + part.slice(1);
    result += capitalized;
  });
  return result;
};

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
