import { ClarityTypes, Transaction } from '@clarion/proxy';

export interface SimpleContract {
  getName: () => Transaction<ClarityTypes.StringAsciiCV, ClarityTypes.NoneCV>;
}
