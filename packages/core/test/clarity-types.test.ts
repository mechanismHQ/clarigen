import { cvToValue, parseToCV, ok, transformArgsToCV, cvToJSON } from '../src/clarity-types';
import {
  bufferCV,
  contractPrincipalCV,
  intCV,
  responseOkCV,
  stringAsciiCV,
  tupleCV,
  uintCV,
} from 'micro-stacks/clarity';

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

test('transforming args array to CV', () => {
  const args = transformArgsToCV(
    {
      name: 'echo',
      access: 'public',
      outputs: { type: 'bool' },
      args: [{ name: 'val', type: { 'string-ascii': { length: 10 } } }],
    },
    ['hello']
  );
  expect(args).toEqual([stringAsciiCV('hello')]);
});

test('transforming args object to CV', () => {
  const args = transformArgsToCV(
    {
      name: 'echo',
      access: 'public',
      outputs: { type: 'bool' },
      args: [{ name: 'val', type: { 'string-ascii': { length: 10 } } }],
    },
    [{ val: 'hello' }]
  );
  expect(args).toEqual([stringAsciiCV('hello')]);
});

describe('cvToJSON', () => {
  const cv = tupleCV({
    numA: uintCV(2n),
    numB: intCV(3n),
    buff: bufferCV(new Uint8Array([0])),
  });

  it('converts to json properly', () => {
    const json = cvToJSON(cv);
    expect(json).toEqual({
      numA: '2',
      numB: '3',
      buff: '00',
    });
  });
});
