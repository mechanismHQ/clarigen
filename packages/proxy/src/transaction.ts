import { ClarityValue } from '@stacks/transactions';

export interface TransactionResult {
  value: ClarityValue;
}

export interface TransactionReceipt {
  getResult: () => Promise<TransactionResult>;
}

export interface SubmitOptions {
  sender?: string;
}

export type Submitter = (options?: SubmitOptions) => Promise<TransactionReceipt>;

export interface Transaction {
  submit: Submitter;
}
