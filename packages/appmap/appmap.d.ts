import * as Clarity from '@stacks/transactions';
import { Transaction } from '@clarion/proxy';

interface AppMapContract {
  registerApp: (owner: string, appContractId: string, storageModel: string) => Transaction;
  setAppLive: (index: string, owner: string, appContractId: string, storageModel: string) => Transaction;
  transferAdministrator: (newAdministrator: string) => Transaction;
  getAdministrator: () => Promise<Clarity.PrincipalCV>;
  getApp: (index: string) => Promise<Clarity.ResponseCV>;
  getAppCounter: () => Promise<Clarity.ResponseCV>;
}
