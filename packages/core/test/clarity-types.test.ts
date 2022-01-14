import { cvToValue, parseToCV } from '../src/clarity-types';
import { contractPrincipalCV, intCV, responseOkCV, uintCV } from 'micro-stacks/clarity';
import { ok } from 'neverthrow';

describe('cvToValue', () => {
  test('can turn clarity negative integer into bignum', () => {
    expect(cvToValue(intCV(-200n))).toEqual(-200n);
    expect(cvToValue(intCV(200n))).toEqual(200n);
    expect(cvToValue(intCV(0n))).toEqual(0n);
  });

  test('can handle responses correctly', () => {
    const ok = responseOkCV(uintCV(100));
    const value = cvToValue(ok);
    expect(value).toEqual(100n);
  });

  test('can return full response if specified', () => {
    const okCV = responseOkCV(uintCV(100));
    const value = cvToValue(okCV, true);
    expect(value).toEqual(ok(100n));
  });
});

describe('parseToCV', () => {
  test('can handle trait references correctly', () => {
    const cv = parseToCV('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.asdf', 'trait_reference');
    expect(cv).toEqual(contractPrincipalCV('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.asdf'));
  });
});
