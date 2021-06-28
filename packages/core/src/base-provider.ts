import { ClarityAbiFunction, ClarityAbiVariable } from '@stacks/transactions';
import { ClarityAbiMap } from './clarity-types';
import { Transaction } from './transaction';

export abstract class BaseProvider {
  // eslint-disable-next-line @typescript-eslint/require-await
  async callReadOnly(func: ClarityAbiFunction, args: any[]) {
    throw new Error('Not implemented');
  }

  callPublic(func: ClarityAbiFunction, args: any[]): Transaction<any, any> {
    throw new Error('Not implemented');
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async callMap(map: ClarityAbiMap, key: any) {
    throw new Error('Not implemented');
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async callVariable(variable: ClarityAbiVariable) {
    throw new Error('Not implemented');
  }
}
