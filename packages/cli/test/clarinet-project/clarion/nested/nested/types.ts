import { ClarityTypes, Transaction } from '@clarigen/core';

// prettier-ignore
export interface NestedContract {
  hello: () => Promise<boolean>;
}
