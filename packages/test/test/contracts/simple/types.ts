import { ClarityTypes, Transaction } from '@clarion/core';

export interface SimpleContract {
  getName: () => Transaction<string, null>;
  getNumber: () => Promise<number>;
}
