// import { ClarityValue, ResponseErrorCV, ResponseOkCV } from '@stacks/transactions';
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

export interface TransactionReceipt<Ok, Err> {
  getResult: () => Promise<TransactionResult<Ok, Err>>;
}

export interface SubmitOptions {
  sender?: string;
}

export type Submitter<Ok, Err> = (options?: SubmitOptions) => Promise<TransactionReceipt<Ok, Err>>;

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
