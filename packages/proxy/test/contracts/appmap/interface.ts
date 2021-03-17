import { ClarityTypes, Transaction } from '@clarion/proxy';

export interface AppMapContract {
  registerApp: (
    owner: string,
    appContractId: string,
    storageModel: string
  ) => Transaction<ClarityTypes.IntCV, ClarityTypes.UIntCV>;
  setAppLive: (
    index: string,
    owner: string,
    appContractId: string,
    storageModel: string
  ) => Transaction<ClarityTypes.BooleanCV, ClarityTypes.UIntCV>;
  transferAdministrator: (
    newAdministrator: string
  ) => Transaction<ClarityTypes.BooleanCV, ClarityTypes.UIntCV>;
  getAdministrator: () => Promise<ClarityTypes.PrincipalCV>;
  getApp: (index: string) => Promise<ClarityTypes.ResponseCV>;
  getAppCounter: () => Promise<ClarityTypes.ResponseCV>;
}
