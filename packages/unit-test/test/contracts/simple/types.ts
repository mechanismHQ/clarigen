import { ClarityTypes, Transaction } from '@clarigen/core';

export interface SimpleContract {
  getName: () => Transaction<string, null>;
  getNumber: () => Promise<number>;
}
