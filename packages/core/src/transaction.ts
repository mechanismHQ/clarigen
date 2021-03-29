// import { ClarityValue, ResponseErrorCV, ResponseOkCV } from '@stacks/transactions';
import { PostCondition, StacksTransaction } from '@stacks/transactions';
import { Ok } from 'neverthrow';
// import { Result } from 'neverthrow';
// import { ClarityTypes } from './clarity-types';

export interface TransactionResultOk<Ok> {
  value: Ok;
  response: ResponseOk<Ok>;
  isOk: true;
  events: any[];
  // TODO: add events
}

export interface TransactionResultErr<Err> {
  value: Err;
  response: ResponseErr<Err>;
  isOk: false;
}

export type TransactionResult<Ok, Err> = TransactionResultOk<Ok> | TransactionResultErr<Err>;

export interface TransactionReceiptBase<Ok, Err> {
  getResult: () => Promise<TransactionResult<Ok, Err>>;
}

export interface WebTransactionReceipt<Ok, Err> extends TransactionReceiptBase<Ok, Err> {
  txId: string;
  stacksTransaction: StacksTransaction;
}

export type TransactionReceipt<Ok, Err> =
  | WebTransactionReceipt<Ok, Err>
  | TransactionReceiptBase<Ok, Err>;

export interface WebSignerOptions {
  postConditions?: PostCondition[];
}

export interface TestSignerOptions {
  sender: string;
}

export type SubmitOptions = TestSignerOptions | WebSignerOptions;

export type Submitter<Ok, Err> = (options: SubmitOptions) => Promise<TransactionReceipt<Ok, Err>>;

interface ResponseOk<Ok> {
  value: Ok;
}

interface ResponseErr<Err> {
  value: Err;
}

export type Response<Ok, Err> = ResponseOk<Ok> | ResponseErr<Err>;

// export interface TransactionOld {
//   submit: Submitter;
// }

export interface Transaction<Ok, Err> {
  submit: Submitter<Ok, Err>;
}
