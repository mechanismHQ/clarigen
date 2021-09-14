import { ClarityTypes, Transaction } from '@clarigen/core';

// prettier-ignore
export interface TestProjectContract {
  getName: () => Transaction<string, null>;
  getNumber: () => Promise<bigint>;
}
