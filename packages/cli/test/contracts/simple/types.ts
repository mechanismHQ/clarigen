import { Response, ContractCalls } from '@clarigen/core';

// prettier-ignore
export interface SimpleContract {
  getName: () => ContractCalls.Public<string, null>;
  getTuplePub: () => ContractCalls.Public<{
  "a": bigint;
  "b": boolean
    }, null>;
  fnWithFor: (_for: boolean) => ContractCalls.ReadOnly<boolean>;
  getBuff: () => ContractCalls.ReadOnly<Uint8Array>;
  getTuple: () => ContractCalls.ReadOnly<{
  "a": bigint;
  "b": boolean
    }>;
  getTupleResp: () => ContractCalls.ReadOnly<Response<{
  "a": bigint;
  "b": boolean;
  "c": {
  "d": bigint
    }
    }, null>>;
  simpleMap: (key: number | bigint) => ContractCalls.Map<number | bigint, boolean>;
  tupleKeyMap: (key: {
  "a": bigint;
  "b": boolean
    }) => ContractCalls.Map<{
  "a": bigint;
  "b": boolean
    }, string>;
  tupleValMap: (key: number | bigint) => ContractCalls.Map<number | bigint, {
  "a": bigint;
  "b": boolean
    }>;
}
