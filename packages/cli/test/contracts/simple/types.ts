import { ClarityTypes, Transaction } from '@clarigen/core';

// prettier-ignore
export interface SimpleContract {
  getName: () => Transaction<string, null>;
  getTuplePub: () => Transaction<{
  "a": number;
  "b": boolean
    }, null>;
  getTuple: () => Promise<{
  "a": number;
  "b": boolean
    }>;
  getTupleResp: () => Promise<ClarityTypes.Response<{
  "a": number;
  "b": boolean;
  "c": {
  "d": number
    }
    }, null>>;
}
