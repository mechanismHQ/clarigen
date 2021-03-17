import { ClarityValue, ResponseErrorCV, ResponseOkCV } from '@stacks/transactions';
// import { ClarityTypes } from './clarity-types';

export interface TransactionResult<Ok extends ClarityValue, Err extends ClarityValue> {
  value: ClarityValue;
  response: Response<Ok, Err>;
}

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
