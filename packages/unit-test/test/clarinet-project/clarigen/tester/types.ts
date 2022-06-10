import { Response, ContractCalls } from '@clarigen/core';

// prettier-ignore
export interface TesterContract {
  printErr: () => ContractCalls.Public<null, bigint>;
  printPub: () => ContractCalls.Public<boolean, null>;
  setInMap: (key: number | bigint, val: boolean) => ContractCalls.Public<boolean, null>;
  setNum: (num: number | bigint) => ContractCalls.Public<boolean, null>;
  echo: (val: string) => ContractCalls.ReadOnly<string>;
  echoWithLogs: (val: string) => ContractCalls.ReadOnly<string>;
  roResp: (returnErr: boolean) => ContractCalls.ReadOnly<Response<string, bigint>>;
  simpleMap: (key: number | bigint) => ContractCalls.Map<number | bigint, boolean>;
}
