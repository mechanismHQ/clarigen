import type { TestProvider } from '../src';
declare global {
  namespace NodeJS {
    interface Global {
      t: TestProvider;
    }
  }
  const t: TestProvider;
}

export {};
