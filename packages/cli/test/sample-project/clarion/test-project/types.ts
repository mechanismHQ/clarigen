import { ClarityTypes, Transaction } from '@clarion/proxy';

export interface TestProjectContract {
  getName: () => Transaction<ClarityTypes.StringAsciiCV, ClarityTypes.NoneCV>;
  getNumber: () => Promise<ClarityTypes.UIntCV>;
}
