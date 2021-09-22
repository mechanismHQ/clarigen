import { cvToValue } from '../src/clarity-types';
import { intCV } from '@stacks/transactions';

test('can turn clarity negative integer into bignum', () => {
  expect(cvToValue(intCV(-200n))).toEqual(-200n);
  expect(cvToValue(intCV(200n))).toEqual(200n);
  expect(cvToValue(intCV(0n))).toEqual(0n);
});
