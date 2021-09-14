import { ClarityTypes, Transaction } from '@clarigen/core';

// prettier-ignore
export interface SimpleContract {
  getName: () => Transaction<string, null>;
  getTuplePub: () => Transaction<{
  "a": bigint;
  "b": boolean
    }, null>;
  getTuple: () => Promise<{
  "a": bigint;
  "b": boolean
    }>;
  getTupleResp: () => Promise<ClarityTypes.Response<{
  "a": bigint;
  "b": boolean;
  "c": {
  "d": bigint
    }
    }, null>>;
}
