import { ClarityTypes, ContractCalls } from '@clarigen/core';

// prettier-ignore
export interface SimpleContract {
  getName: () => ContractCalls.Public<ClarityTypes.Response<string, null>>;
  getTuplePub: () => ContractCalls.Public<ClarityTypes.Response<{
  "a": bigint;
  "b": boolean
    }, null>>;
  getTuple: () => ContractCalls.ReadOnly<{
  "a": bigint;
  "b": boolean
    }>;
  getTupleResp: () => ContractCalls.ReadOnly<ClarityTypes.Response<{
  "a": bigint;
  "b": boolean;
  "c": {
  "d": bigint
    }
    }, null>>;
}
