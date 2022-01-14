import { ClarityTypes, ContractCalls } from '@clarigen/core';

// prettier-ignore
export interface EchoContract {
  echo: (val: string) => ContractCalls.ReadOnly<string>;
}
