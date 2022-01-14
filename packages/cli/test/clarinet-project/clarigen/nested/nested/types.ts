import { ClarityTypes, ContractCalls } from '@clarigen/core';

// prettier-ignore
export interface NestedContract {
  hello: () => ContractCalls.ReadOnly<boolean>;
}
