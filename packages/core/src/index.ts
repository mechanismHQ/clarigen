import { toCamelCase } from './utils';
import { ClarityAbi } from './clarity-types';
import { BaseProvider } from './base-provider';
export type { ClarityTypes, ClarityAbi } from './clarity-types';
export * from './transaction';
export * from './types';
export * from './utils';
export * from './events';
export * from './contracts';
export { pureProxy } from './pure';
export type {
  ContractCalls,
  ContractCall,
  ContractFn,
  ContractReturn,
  ContractReturnErr,
  ContractReturnOk,
} from './pure';
export {
  cvToValue,
  parseToCV,
  cvToString,
  hexToCvValue,
  expectErr,
  expectOk,
} from './clarity-types';
export { BaseProvider } from './base-provider';
export * from './api';

const makeHandler = (provider: BaseProvider) => {
  const handler: ProxyHandler<ClarityAbi> = {
    get: (contract, property) => {
      const foundFunction = contract.functions.find(func => {
        return toCamelCase(func.name) === property;
      });
      if (foundFunction) {
        if (foundFunction.access === 'read_only') {
          return (...args: any[]) => {
            return provider.callReadOnly(foundFunction, args);
          };
        } else if (foundFunction.access === 'public') {
          return (...args: any[]) => {
            return provider.callPublic(foundFunction, args);
          };
        }
      }
      return null;
    },
  };
  return handler;
};

interface ProxyConstructor {
  revocable<T extends object, S extends object>(
    target: T,
    handler: ProxyHandler<S>
  ): { proxy: T; revoke: () => void };
  new <T extends object>(target: T, handler: ProxyHandler<T>): T;
  new <T extends object, S extends object>(target: S, handler: ProxyHandler<S>): T;
}
declare const Proxy: ProxyConstructor;

export const proxy = <T extends object>(target: ClarityAbi, provider: BaseProvider): T => {
  return new Proxy<T, ClarityAbi>(target, makeHandler(provider));
};
