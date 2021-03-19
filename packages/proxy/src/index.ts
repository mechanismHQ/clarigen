import type { TestProvider } from './providers/test-provider';
import { toCamelCase } from './utils';
export * from './generator';
import { ClarityAbi } from './clarity-types';
export type { ClarityTypes, ClarityAbi } from './clarity-types';
export * from './declaration';
export * from './transaction';
export { TestProvider } from './providers/test-provider/index';

const makeHandler = (provider: TestProvider) => {
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

export const proxy = <T extends object>(target: ClarityAbi, provider: TestProvider) => {
  return new Proxy<T, ClarityAbi>(target, makeHandler(provider));
};
