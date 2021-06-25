import { ClarityTypes, Transaction } from '@clarigen/core';

// prettier-ignore
export interface EchoContract {
  echo: (val: string) => Promise<string>;
}
