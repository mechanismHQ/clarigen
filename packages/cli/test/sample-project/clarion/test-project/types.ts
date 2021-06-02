import { ClarityTypes, Transaction } from '@clarigen/core';

export interface TestProjectContract {
  getName: () => Transaction<string, null>;
  getNumber: () => Promise<number>;
}
