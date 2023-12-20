import {
  cvToValue,
  parseToCV,
  ok,
  transformArgsToCV,
  cvToJSON,
  Jsonize,
  AbiTypeTo,
  AbiTupleTo,
} from '../src/clarity-types';
import {
  projectFactory,
  ro,
  roOk,
  roErr,
  JsonIfOption,
  ApiOptionsJsonize,
  Response,
  ClarityAbiTypeNonFungibleToken,
} from '../src';
import {
  bufferCV,
  contractPrincipalCV,
  intCV,
  responseOkCV,
  stringAsciiCV,
  tupleCV,
  uintCV,
} from 'micro-stacks/clarity';
import { project, contracts } from 'demo-project';
import { StacksMocknet } from 'micro-stacks/network';

const devnet = projectFactory(project, 'devnet');

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

  test('handling tuples with responses', () => {
    const cv = tupleCV({
      val: responseOkCV(uintCV(100)),
    });
    console.log(cv);

    const value = cvToValue<{ val: Response<bigint, bigint> }>(cv, true);
    expect(value.val.isOk).toEqual(true);
    expect(value.val.value).toEqual(100n);
    console.log(value);
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

// Jsonize
type Tup = {
  a: Uint8Array;
  b: bigint;
  c: {
    d: bigint;
    e: Uint8Array;
    i: boolean;
  };
  f: number;
  g: boolean;
  h: string;
};
type TupJson = Jsonize<Tup>;

const tupJson: TupJson = {
  a: '',
  b: '',
  c: {
    d: '',
    e: '',
    i: true,
  },
  f: 1,
  g: false,
  h: '',
};

type Arr = { a: Uint8Array }[];
type ArrJson = Jsonize<Arr>;

const arrJson: ArrJson = [{ a: '' }];
arrJson.forEach(v => v);

type Fn = (typeof devnet)['tester']['mergeTuple'];

// type RoResp = ReturnType<typeof ro

async function fakeRoApiJson() {
  const res = await ro(devnet.tester.mergeTuple({ i: { minHeight: 1n } }), {
    json: true,
    network: new StacksMocknet(),
  });
  return res;
}
async function fakeRoApi(json: boolean) {
  const res = await ro(devnet.tester.mergeTuple({ i: { minHeight: 1n } }), {
    network: new StacksMocknet(),
    json,
  });
  return res;
}

type ErrRes = JsonIfOption<ApiOptionsJsonize, bigint>;
const e: ErrRes = '1';

type ApiJson = Awaited<ReturnType<typeof fakeRoApiJson>>;
const mergeJson: ApiJson = {
  minHeight: '',
  maxHeight: '',
};
type ApiNorm = Awaited<ReturnType<typeof fakeRoApi>>;
const mergeNorm: ApiNorm = {
  minHeight: 1n,
  maxHeight: 1n,
};

const bnsNftAsset = {
  name: 'names',
  type: {
    tuple: [
      { name: 'name', type: { buffer: { length: 48 } } },
      { name: 'namespace', type: { buffer: { length: 20 } } },
    ],
  },
} as const;

type BnsAsset2 = AbiTypeTo<(typeof bnsNftAsset)['type']>;

type BnsAsset = AbiTypeTo<{
  tuple: [
    { name: 'name'; type: { buffer: { length: 48 } } },
    { name: 'namespace'; type: { buffer: { length: 20 } } }
  ];
}>;

type BnsTup = AbiTupleTo<(typeof bnsNftAsset)['type']>;

type Contract = (typeof devnet)['tester'];

type AA = AbiTypeTo<Contract['non_fungible_tokens'][0]['type']>;
