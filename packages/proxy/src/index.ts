import { ClarityAbi } from '@stacks/transactions';
import type { TestProvider } from './providers/test-provider';
export * from './generator';
export type { ClarityTypes } from './clarity-types.d';
export * from './declaration';
export * from './transaction';
export { TestProvider } from './providers/test-provider/index';

export const toCamelCase = (input: string | number | symbol) => {
  const inputStr = typeof input === 'string' ? input : String(input);
  const [first, ...parts] = inputStr.split('-');
  let result = first;
  parts.forEach(part => {
    const capitalized = part[0].toUpperCase() + part.slice(1);
    result += capitalized;
  });
  return result;
};

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
