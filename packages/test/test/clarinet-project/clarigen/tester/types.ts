import { ClarityTypes, ContractCalls } from '@clarigen/core';

// prettier-ignore
export interface TesterContract {
  printErr: () => ContractCalls.Public<null, bigint>;
  printPub: () => ContractCalls.Public<boolean, null>;
  echo: (val: string) => ContractCalls.ReadOnly<string>;
  echoWithLogs: (val: string) => ContractCalls.ReadOnly<string>;
  roResp: (returnErr: boolean) => ContractCalls.ReadOnly<ClarityTypes.Response<string, bigint>>;
}
