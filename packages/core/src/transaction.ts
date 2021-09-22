import { PostCondition, PostConditionMode, StacksTransaction } from '@stacks/transactions';
import { CoreNodeEvent } from './events';

export interface ResultAssets {
  stx: Record<string, string>;
  burns: Record<string, string>;
  tokens: Record<string, Record<string, string>>;
  assets: Record<string, Record<string, string>>;
}

export interface TransactionResultOk<Ok> {
  value: Ok;
  response: ResponseOk<Ok>;
  isOk: true;
  events: CoreNodeEvent[];
  costs: {
    [key: string]: any;
    runtime: number;
  };
  assets: ResultAssets;
  // TODO: add events
}

export interface TransactionResultErr<Err> {
  value: Err;
  response: ResponseErr<Err>;
  costs: {
    [key: string]: any;
    runtime: number;
  };
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

export interface TestTransacionReceipt<Ok, Err> extends TransactionReceiptBase<Ok, Err> {
  result: TransactionResult<Ok, Err>;
}

export type TransactionReceipt<Ok, Err> =
  | WebTransactionReceipt<Ok, Err>
  | TestTransacionReceipt<Ok, Err>
  | TransactionReceiptBase<Ok, Err>;

export interface WebSignerOptions {
  postConditionMode?: PostConditionMode;
  postConditions?: PostCondition[];
}

export interface TestSignerOptions {
  sender: string;
}

export interface NodeSignerOptions {
  postConditionMode?: PostConditionMode;
  nonce?: number;
  postConditions?: PostCondition[];
}

export type SubmitOptions = TestSignerOptions | WebSignerOptions | NodeSignerOptions;

export type Submitter<Ok, Err> = (options: SubmitOptions) => Promise<TransactionReceipt<Ok, Err>>;

interface ResponseOk<Ok> {
  value: Ok;
}

interface ResponseErr<Err> {
  value: Err;
}

export type Response<Ok, Err> = ResponseOk<Ok> | ResponseErr<Err>;

export interface Transaction<Ok, Err> {
  submit: Submitter<Ok, Err>;
}
