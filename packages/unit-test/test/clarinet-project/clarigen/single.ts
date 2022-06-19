export type ClarityAbiTypeBuffer = { buffer: { length: number } };
export type ClarityAbiTypeStringAscii = { 'string-ascii': { length: number } };
export type ClarityAbiTypeStringUtf8 = { 'string-utf8': { length: number } };
export type ClarityAbiTypeResponse = { response: { ok: ClarityAbiType; error: ClarityAbiType } };
export type ClarityAbiTypeOptional = { optional: ClarityAbiType };
export type ClarityAbiTypeTuple = { tuple: { name: string; type: ClarityAbiType }[] };
export type ClarityAbiTypeList = { list: { type: ClarityAbiType; length: number } };

export type ClarityAbiTypeUInt128 = 'uint128';
export type ClarityAbiTypeInt128 = 'int128';
export type ClarityAbiTypeBool = 'bool';
export type ClarityAbiTypePrincipal = 'principal';
export type ClarityAbiTypeTraitReference = 'trait_reference';
export type ClarityAbiTypeNone = 'none';

export type ClarityAbiTypePrimitive =
  | ClarityAbiTypeUInt128
  | ClarityAbiTypeInt128
  | ClarityAbiTypeBool
  | ClarityAbiTypePrincipal
  | ClarityAbiTypeTraitReference
  | ClarityAbiTypeNone;

export type ClarityAbiType =
  | ClarityAbiTypePrimitive
  | ClarityAbiTypeBuffer
  | ClarityAbiTypeResponse
  | ClarityAbiTypeOptional
  | ClarityAbiTypeTuple
  | ClarityAbiTypeList
  | ClarityAbiTypeStringAscii
  | ClarityAbiTypeStringUtf8
  | ClarityAbiTypeTraitReference;

export interface ClarityAbiFunction {
  name: string;
  access: 'private' | 'public' | 'read_only';
  args: {
    name: string;
    type: ClarityAbiType;
  }[];
  outputs: {
    type: ClarityAbiType;
  };
}

export type TypedAbiFunction<T extends any[], R> = ClarityAbiFunction & {
  _t?: T;
  _r?: R;
};

export interface ClarityAbiVariable {
  name: string;
  access: 'variable' | 'constant';
  type: ClarityAbiType;
}

export type TypedAbiVariable<T> = ClarityAbiVariable & {
  defaultValue: T;
};

export interface ClarityAbiMap {
  name: string;
  key: ClarityAbiType;
  value: ClarityAbiType;
}

export type TypedAbiMap<K, V> = ClarityAbiMap & {
  _k?: K;
  _v?: V;
};

export interface ClarityAbiTypeFungibleToken {
  name: string;
}

export interface ClarityAbiTypeNonFungibleToken {
  name: string;
  type: ClarityAbiType;
}

export interface ClarityAbi {
  functions: ClarityAbiFunction[];
  variables: ClarityAbiVariable[];
  maps: ClarityAbiMap[];
  fungible_tokens: ClarityAbiTypeFungibleToken[];
  non_fungible_tokens: ClarityAbiTypeNonFungibleToken[];
}

export type TypedAbi = Readonly<{
  functions: {
    [key: string]: TypedAbiFunction<unknown[], unknown>;
  };
  variables: {
    [key: string]: TypedAbiVariable<unknown>;
  };
  maps: {
    [key: string]: TypedAbiMap<unknown, unknown>;
  };
  constants: {
    [key: string]: any;
  };
  fungible_tokens: Readonly<ClarityAbiTypeFungibleToken[]>;
  non_fungible_tokens: Readonly<ClarityAbiTypeNonFungibleToken[]>;
  contractName: string;
  contractFile?: string;
}>;

export interface ResponseOk<T, E> {
  value: T;
  isOk: true;
}

export interface ResponseErr<T, E> {
  value: E;
  isOk: false;
}

export type Response<Ok, Err> = ResponseOk<Ok, Err> | ResponseErr<Ok, Err>;

export const contracts = {
  tester: {
    functions: {
      printErr: {
        access: 'public',
        args: [],
        name: 'print-err',
        outputs: { type: { response: { error: 'uint128', ok: 'none' } } },
      } as TypedAbiFunction<[], Response<null, bigint>>,
      printPub: {
        access: 'public',
        args: [],
        name: 'print-pub',
        outputs: { type: { response: { error: 'none', ok: 'bool' } } },
      } as TypedAbiFunction<[], Response<boolean, null>>,
      setInMap: {
        access: 'public',
        args: [
          { name: 'key', type: 'uint128' },
          { name: 'val', type: 'bool' },
        ],
        name: 'set-in-map',
        outputs: { type: { response: { error: 'none', ok: 'bool' } } },
      } as TypedAbiFunction<[key: number | bigint, val: boolean], Response<boolean, null>>,
      setNum: {
        access: 'public',
        args: [{ name: 'num', type: 'uint128' }],
        name: 'set-num',
        outputs: { type: { response: { error: 'none', ok: 'bool' } } },
      } as TypedAbiFunction<[num: number | bigint], Response<boolean, null>>,
      echo: {
        access: 'read_only',
        args: [{ name: 'val', type: { 'string-ascii': { length: 33 } } }],
        name: 'echo',
        outputs: { type: { 'string-ascii': { length: 33 } } },
      } as TypedAbiFunction<[val: string], string>,
      echoWithLogs: {
        access: 'read_only',
        args: [{ name: 'val', type: { 'string-ascii': { length: 33 } } }],
        name: 'echo-with-logs',
        outputs: { type: { 'string-ascii': { length: 33 } } },
      } as TypedAbiFunction<[val: string], string>,
      roResp: {
        access: 'read_only',
        args: [{ name: 'return-err', type: 'bool' }],
        name: 'ro-resp',
        outputs: {
          type: { response: { error: 'uint128', ok: { 'string-ascii': { length: 4 } } } },
        },
      } as TypedAbiFunction<[returnErr: boolean], Response<string, bigint>>,
    },
    variables: {
      numVar: {
        access: 'variable',
        name: 'num-var',
        type: 'uint128',
        defaultValue: 0n,
      } as TypedAbiVariable<bigint>,
    },
    maps: {
      simpleMap: { key: 'uint128', name: 'simple-map', value: 'bool' } as TypedAbiMap<
        bigint,
        boolean
      >,
    },
    constants: {},
    fungible_tokens: [],
    non_fungible_tokens: [],
    contractName: 'tester',
    contractFile: 'test/clarinet-project/contracts/tester.clar',
  },
} as const;

export const accounts = {
  deployer: {
    mnemonic:
      'fetch outside black test wash cover just actual execute nice door want airport betray quantum stamp fish act pen trust portion fatigue scissors vague',
    balance: 1000000000000000n,
    address: 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
  },
  wallet_1: {
    mnemonic:
      'spoil sock coyote include verify comic jacket gain beauty tank flush victory illness edge reveal shallow plug hobby usual juice harsh pact wreck eight',
    balance: 1000000000000000n,
    address: 'ST1J4G6RR643BCG8G8SR6M2D9Z9KXT2NJDRK3FBTK',
  },
  wallet_2: {
    mnemonic:
      'arrange scale orient half ugly kid bike twin magnet joke hurt fiber ethics super receive version wreck media fluid much abstract reward street alter',
    balance: 1000000n,
    address: 'ST20ATRN26N9P05V2F1RHFRV24X8C8M3W54E427B2',
  },
} as const;
