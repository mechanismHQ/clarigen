import { ClarityAbiFunction } from 'micro-stacks/clarity';
import { Transaction } from './transaction';

export abstract class BaseProvider {
  // eslint-disable-next-line @typescript-eslint/require-await
  async callReadOnly(func: ClarityAbiFunction, args: any[]) {
    throw new Error('Not implemented');
  }

  callPublic(func: ClarityAbiFunction, args: any[]): Transaction<any, any> {
    throw new Error('Not implemented');
  }
}
