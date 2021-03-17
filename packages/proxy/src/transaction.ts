import { ClarityValue, ResponseErrorCV, ResponseOkCV } from '@stacks/transactions';
// import { ClarityTypes } from './clarity-types';

export interface TransactionResultOld<Ok extends ClarityValue, Err extends ClarityValue> {
  value: ClarityValue;
  response: Response<Ok, Err>;
  isOk: boolean;
}

export interface TransactionResultOk<Ok extends ClarityValue> {
  value: Ok;
  response: ResponseOk<Ok>;
  isOk: true;
  // TODO: add events
}

export interface TransactionResultErr<Err extends ClarityValue> {
  value: Err;
  response: ResponseErr<Err>;
  isOk: false;
}

export type TransactionResult<Ok extends ClarityValue, Err extends ClarityValue> =
  | TransactionResultOk<Ok>
  | TransactionResultErr<Err>;

export interface TransactionReceipt<Ok extends ClarityValue, Err extends ClarityValue> {
  getResult: () => Promise<TransactionResult<Ok, Err>>;
}

export interface SubmitOptions {
  sender?: string;
}

export type Submitter<Ok extends ClarityValue, Err extends ClarityValue> = (
  options?: SubmitOptions
) => Promise<TransactionReceipt<Ok, Err>>;

interface ResponseOk<Ok extends ClarityValue> extends ResponseOkCV {
  value: Ok;
}

interface ResponseErr<Err extends ClarityValue> extends ResponseErrorCV {
  value: Err;
}

export type Response<Ok extends ClarityValue, Err extends ClarityValue> =
  | ResponseOk<Ok>
  | ResponseErr<Err>;

// export interface TransactionOld {
//   submit: Submitter;
// }

export interface Transaction<Ok extends ClarityValue, Err extends ClarityValue> {
  submit: Submitter<Ok, Err>;
}
