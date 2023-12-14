export type ClarityAbiTypeBuffer = { buffer: { length: number } };
export type ClarityAbiTypeStringAscii = { 'string-ascii': { length: number } };
export type ClarityAbiTypeStringUtf8 = { 'string-utf8': { length: number } };
export type ClarityAbiTypeResponse = {
  response: { ok: ClarityAbiType; error: ClarityAbiType };
};
export type ClarityAbiTypeOptional = { optional: ClarityAbiType };
export type ClarityAbiTypeTuple = {
  tuple: readonly { name: string; type: ClarityAbiType }[];
};
export type ClarityAbiTypeList = {
  list: { type: ClarityAbiType; length: number };
};

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

export interface ClarityAbiArg {
  name: string;
  type: ClarityAbiType;
}

export interface ClarityAbiFunction {
  name: string;
  access: 'private' | 'public' | 'read_only';
  args: ClarityAbiArg[];
  outputs: {
    type: ClarityAbiType;
  };
}

export type TypedAbiArg<T, N extends string> = { _t?: T; name: N };

export type TypedAbiFunction<T extends TypedAbiArg<unknown, string>[], R> = ClarityAbiFunction & {
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

export interface ClarityAbiTypeNonFungibleToken<T = unknown> {
  name: string;
  type: ClarityAbiType;
  _t?: T;
}

export interface ClarityAbi {
  functions: ClarityAbiFunction[];
  variables: ClarityAbiVariable[];
  maps: ClarityAbiMap[];
  fungible_tokens: ClarityAbiTypeFungibleToken[];
  non_fungible_tokens: readonly ClarityAbiTypeNonFungibleToken<unknown>[];
}

export type TypedAbi = Readonly<{
  functions: {
    [key: string]: TypedAbiFunction<TypedAbiArg<unknown, string>[], unknown>;
  };
  variables: {
    [key: string]: TypedAbiVariable<unknown>;
  };
  maps: {
    [key: string]: TypedAbiMap<unknown, unknown>;
  };
  constants: {
    [key: string]: unknown;
  };
  fungible_tokens: Readonly<ClarityAbiTypeFungibleToken[]>;
  non_fungible_tokens: Readonly<ClarityAbiTypeNonFungibleToken<unknown>[]>;
  contractName: string;
  contractFile?: string;
}>;

export interface ResponseOk<T, E> {
  value: T;
  isOk: true;
  _e?: E;
}

export interface ResponseErr<T, E> {
  value: E;
  isOk: false;
  _o?: T;
}

export type Response<Ok, Err> = ResponseOk<Ok, Err> | ResponseErr<Ok, Err>;

export type OkType<R> = R extends ResponseOk<infer V, unknown> ? V : never;
export type ErrType<R> = R extends ResponseErr<unknown, infer V> ? V : never;

export const contracts = {
  counter: {
    functions: {
      decrement: {
        name: 'decrement',
        access: 'public',
        args: [{ name: 'step', type: 'uint128' }],
        outputs: { type: { response: { ok: 'uint128', error: 'none' } } },
      } as TypedAbiFunction<[step: TypedAbiArg<number | bigint, 'step'>], Response<bigint, null>>,
      increment: {
        name: 'increment',
        access: 'public',
        args: [{ name: 'step', type: 'uint128' }],
        outputs: { type: { response: { ok: 'uint128', error: 'none' } } },
      } as TypedAbiFunction<[step: TypedAbiArg<number | bigint, 'step'>], Response<bigint, null>>,
      getCounter: {
        name: 'get-counter',
        access: 'read_only',
        args: [],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[], bigint>,
    },
    maps: {},
    variables: {
      counter: {
        name: 'counter',
        type: 'uint128',
        access: 'variable',
      } as TypedAbiVariable<bigint>,
    },
    // TODO: fix with clarinet v2
    // constants: undefined,
    constants: {},
    non_fungible_tokens: [],
    fungible_tokens: [],
    epoch: 'Epoch21',
    clarity_version: 'Clarity1',
    contractName: 'counter',
  },
  ftTrait: {
    functions: {},
    maps: {},
    variables: {},
    // TODO: fix with clarinet v2
    // constants: undefined,
    constants: {},
    non_fungible_tokens: [],
    fungible_tokens: [],
    epoch: 'Epoch21',
    clarity_version: 'Clarity1',
    contractName: 'ft-trait',
  },
  restrictedTokenTrait: {
    functions: {},
    maps: {},
    variables: {},
    // TODO: fix with clarinet v2
    // constants: undefined,
    constants: {},
    non_fungible_tokens: [],
    fungible_tokens: [],
    epoch: 'Epoch21',
    clarity_version: 'Clarity1',
    contractName: 'restricted-token-trait',
  },
  tester: {
    functions: {
      printErr: {
        name: 'print-err',
        access: 'public',
        args: [],
        outputs: { type: { response: { ok: 'none', error: 'uint128' } } },
      } as TypedAbiFunction<[], Response<null, bigint>>,
      printPub: {
        name: 'print-pub',
        access: 'public',
        args: [],
        outputs: { type: { response: { ok: 'bool', error: 'none' } } },
      } as TypedAbiFunction<[], Response<boolean, null>>,
      setInMap: {
        name: 'set-in-map',
        access: 'public',
        args: [
          { name: 'key', type: 'uint128' },
          { name: 'val', type: 'bool' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'none' } } },
      } as TypedAbiFunction<
        [key: TypedAbiArg<number | bigint, 'key'>, val: TypedAbiArg<boolean, 'val'>],
        Response<boolean, null>
      >,
      setNum: {
        name: 'set-num',
        access: 'public',
        args: [{ name: 'num', type: 'uint128' }],
        outputs: { type: { response: { ok: 'bool', error: 'none' } } },
      } as TypedAbiFunction<[num: TypedAbiArg<number | bigint, 'num'>], Response<boolean, null>>,
      echo: {
        name: 'echo',
        access: 'read_only',
        args: [{ name: 'val', type: { 'string-ascii': { length: 33 } } }],
        outputs: { type: { 'string-ascii': { length: 33 } } },
      } as TypedAbiFunction<[val: TypedAbiArg<string, 'val'>], string>,
      echoWithLogs: {
        name: 'echo-with-logs',
        access: 'read_only',
        args: [{ name: 'val', type: { 'string-ascii': { length: 33 } } }],
        outputs: { type: { 'string-ascii': { length: 33 } } },
      } as TypedAbiFunction<[val: TypedAbiArg<string, 'val'>], string>,
      getTup: {
        name: 'get-tup',
        access: 'read_only',
        args: [],
        outputs: {
          type: {
            tuple: [
              { name: 'a', type: 'uint128' },
              { name: 'bool-prop', type: 'bool' },
              {
                name: 'tuple-prop',
                type: { tuple: [{ name: 'sub-prop', type: { 'string-ascii': { length: 4 } } }] },
              },
            ],
          },
        },
      } as TypedAbiFunction<
        [],
        {
          a: bigint;
          boolProp: boolean;
          tupleProp: {
            subProp: string;
          };
        }
      >,
      mergeTuple: {
        name: 'merge-tuple',
        access: 'read_only',
        args: [{ name: 'i', type: { tuple: [{ name: 'min-height', type: 'uint128' }] } }],
        outputs: {
          type: {
            tuple: [
              { name: 'max-height', type: 'uint128' },
              { name: 'min-height', type: 'uint128' },
            ],
          },
        },
      } as TypedAbiFunction<
        [
          i: TypedAbiArg<
            {
              minHeight: number | bigint;
            },
            'i'
          >
        ],
        {
          maxHeight: bigint;
          minHeight: bigint;
        }
      >,
      roResp: {
        name: 'ro-resp',
        access: 'read_only',
        args: [{ name: 'return-err', type: 'bool' }],
        outputs: {
          type: { response: { ok: { 'string-ascii': { length: 4 } }, error: 'uint128' } },
        },
      } as TypedAbiFunction<
        [returnErr: TypedAbiArg<boolean, 'returnErr'>],
        Response<string, bigint>
      >,
    },
    maps: {
      simpleMap: { name: 'simple-map', key: 'uint128', value: 'bool' } as TypedAbiMap<
        number | bigint,
        boolean
      >,
    },
    variables: {
      numVar: {
        name: 'num-var',
        type: 'uint128',
        access: 'variable',
      } as TypedAbiVariable<bigint>,
    },
    // TODO: fix with clarinet v2
    // constants: undefined,
    constants: {},
    non_fungible_tokens: [{ name: 'nft', type: 'uint128' }],
    fungible_tokens: [{ name: 'ft' }],
    epoch: 'Epoch21',
    clarity_version: 'Clarity1',
    contractName: 'tester',
  },
  wrappedBitcoin: {
    functions: {
      addPrincipalToRole: {
        name: 'add-principal-to-role',
        access: 'public',
        args: [
          { name: 'role-to-add', type: 'uint128' },
          { name: 'principal-to-add', type: 'principal' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'uint128' } } },
      } as TypedAbiFunction<
        [
          roleToAdd: TypedAbiArg<number | bigint, 'roleToAdd'>,
          principalToAdd: TypedAbiArg<string, 'principalToAdd'>
        ],
        Response<boolean, bigint>
      >,
      burnTokens: {
        name: 'burn-tokens',
        access: 'public',
        args: [
          { name: 'burn-amount', type: 'uint128' },
          { name: 'burn-from', type: 'principal' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'uint128' } } },
      } as TypedAbiFunction<
        [
          burnAmount: TypedAbiArg<number | bigint, 'burnAmount'>,
          burnFrom: TypedAbiArg<string, 'burnFrom'>
        ],
        Response<boolean, bigint>
      >,
      initialize: {
        name: 'initialize',
        access: 'public',
        args: [
          { name: 'name-to-set', type: { 'string-ascii': { length: 32 } } },
          { name: 'symbol-to-set', type: { 'string-ascii': { length: 32 } } },
          { name: 'decimals-to-set', type: 'uint128' },
          { name: 'initial-owner', type: 'principal' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'uint128' } } },
      } as TypedAbiFunction<
        [
          nameToSet: TypedAbiArg<string, 'nameToSet'>,
          symbolToSet: TypedAbiArg<string, 'symbolToSet'>,
          decimalsToSet: TypedAbiArg<number | bigint, 'decimalsToSet'>,
          initialOwner: TypedAbiArg<string, 'initialOwner'>
        ],
        Response<boolean, bigint>
      >,
      mintTokens: {
        name: 'mint-tokens',
        access: 'public',
        args: [
          { name: 'mint-amount', type: 'uint128' },
          { name: 'mint-to', type: 'principal' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'uint128' } } },
      } as TypedAbiFunction<
        [
          mintAmount: TypedAbiArg<number | bigint, 'mintAmount'>,
          mintTo: TypedAbiArg<string, 'mintTo'>
        ],
        Response<boolean, bigint>
      >,
      removePrincipalFromRole: {
        name: 'remove-principal-from-role',
        access: 'public',
        args: [
          { name: 'role-to-remove', type: 'uint128' },
          { name: 'principal-to-remove', type: 'principal' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'uint128' } } },
      } as TypedAbiFunction<
        [
          roleToRemove: TypedAbiArg<number | bigint, 'roleToRemove'>,
          principalToRemove: TypedAbiArg<string, 'principalToRemove'>
        ],
        Response<boolean, bigint>
      >,
      revokeTokens: {
        name: 'revoke-tokens',
        access: 'public',
        args: [
          { name: 'revoke-amount', type: 'uint128' },
          { name: 'revoke-from', type: 'principal' },
          { name: 'revoke-to', type: 'principal' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'uint128' } } },
      } as TypedAbiFunction<
        [
          revokeAmount: TypedAbiArg<number | bigint, 'revokeAmount'>,
          revokeFrom: TypedAbiArg<string, 'revokeFrom'>,
          revokeTo: TypedAbiArg<string, 'revokeTo'>
        ],
        Response<boolean, bigint>
      >,
      setTokenUri: {
        name: 'set-token-uri',
        access: 'public',
        args: [{ name: 'updated-uri', type: { 'string-utf8': { length: 256 } } }],
        outputs: { type: { response: { ok: 'bool', error: 'uint128' } } },
      } as TypedAbiFunction<
        [updatedUri: TypedAbiArg<string, 'updatedUri'>],
        Response<boolean, bigint>
      >,
      transfer: {
        name: 'transfer',
        access: 'public',
        args: [
          { name: 'amount', type: 'uint128' },
          { name: 'sender', type: 'principal' },
          { name: 'recipient', type: 'principal' },
          { name: 'memo', type: { optional: { buffer: { length: 34 } } } },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'uint128' } } },
      } as TypedAbiFunction<
        [
          amount: TypedAbiArg<number | bigint, 'amount'>,
          sender: TypedAbiArg<string, 'sender'>,
          recipient: TypedAbiArg<string, 'recipient'>,
          memo: TypedAbiArg<Uint8Array | null, 'memo'>
        ],
        Response<boolean, bigint>
      >,
      updateBlacklisted: {
        name: 'update-blacklisted',
        access: 'public',
        args: [
          { name: 'principal-to-update', type: 'principal' },
          { name: 'set-blacklisted', type: 'bool' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'uint128' } } },
      } as TypedAbiFunction<
        [
          principalToUpdate: TypedAbiArg<string, 'principalToUpdate'>,
          setBlacklisted: TypedAbiArg<boolean, 'setBlacklisted'>
        ],
        Response<boolean, bigint>
      >,
      detectTransferRestriction: {
        name: 'detect-transfer-restriction',
        access: 'read_only',
        args: [
          { name: 'amount', type: 'uint128' },
          { name: 'sender', type: 'principal' },
          { name: 'recipient', type: 'principal' },
        ],
        outputs: { type: { response: { ok: 'uint128', error: 'uint128' } } },
      } as TypedAbiFunction<
        [
          amount: TypedAbiArg<number | bigint, 'amount'>,
          sender: TypedAbiArg<string, 'sender'>,
          recipient: TypedAbiArg<string, 'recipient'>
        ],
        Response<bigint, bigint>
      >,
      getBalance: {
        name: 'get-balance',
        access: 'read_only',
        args: [{ name: 'owner', type: 'principal' }],
        outputs: { type: { response: { ok: 'uint128', error: 'none' } } },
      } as TypedAbiFunction<[owner: TypedAbiArg<string, 'owner'>], Response<bigint, null>>,
      getDecimals: {
        name: 'get-decimals',
        access: 'read_only',
        args: [],
        outputs: { type: { response: { ok: 'uint128', error: 'none' } } },
      } as TypedAbiFunction<[], Response<bigint, null>>,
      getName: {
        name: 'get-name',
        access: 'read_only',
        args: [],
        outputs: { type: { response: { ok: { 'string-ascii': { length: 32 } }, error: 'none' } } },
      } as TypedAbiFunction<[], Response<string, null>>,
      getSymbol: {
        name: 'get-symbol',
        access: 'read_only',
        args: [],
        outputs: { type: { response: { ok: { 'string-ascii': { length: 32 } }, error: 'none' } } },
      } as TypedAbiFunction<[], Response<string, null>>,
      getTokenUri: {
        name: 'get-token-uri',
        access: 'read_only',
        args: [],
        outputs: {
          type: {
            response: { ok: { optional: { 'string-utf8': { length: 256 } } }, error: 'none' },
          },
        },
      } as TypedAbiFunction<[], Response<string | null, null>>,
      getTotalSupply: {
        name: 'get-total-supply',
        access: 'read_only',
        args: [],
        outputs: { type: { response: { ok: 'uint128', error: 'none' } } },
      } as TypedAbiFunction<[], Response<bigint, null>>,
      hasRole: {
        name: 'has-role',
        access: 'read_only',
        args: [
          { name: 'role-to-check', type: 'uint128' },
          { name: 'principal-to-check', type: 'principal' },
        ],
        outputs: { type: 'bool' },
      } as TypedAbiFunction<
        [
          roleToCheck: TypedAbiArg<number | bigint, 'roleToCheck'>,
          principalToCheck: TypedAbiArg<string, 'principalToCheck'>
        ],
        boolean
      >,
      isBlacklisted: {
        name: 'is-blacklisted',
        access: 'read_only',
        args: [{ name: 'principal-to-check', type: 'principal' }],
        outputs: { type: 'bool' },
      } as TypedAbiFunction<[principalToCheck: TypedAbiArg<string, 'principalToCheck'>], boolean>,
      messageForRestriction: {
        name: 'message-for-restriction',
        access: 'read_only',
        args: [{ name: 'restriction-code', type: 'uint128' }],
        outputs: { type: { response: { ok: { 'string-ascii': { length: 70 } }, error: 'none' } } },
      } as TypedAbiFunction<
        [restrictionCode: TypedAbiArg<number | bigint, 'restrictionCode'>],
        Response<string, null>
      >,
    },
    maps: {
      blacklist: {
        name: 'blacklist',
        key: { tuple: [{ name: 'account', type: 'principal' }] },
        value: { tuple: [{ name: 'blacklisted', type: 'bool' }] },
      } as TypedAbiMap<
        {
          account: string;
        },
        {
          blacklisted: boolean;
        }
      >,
      roles: {
        name: 'roles',
        key: {
          tuple: [
            { name: 'account', type: 'principal' },
            { name: 'role', type: 'uint128' },
          ],
        },
        value: { tuple: [{ name: 'allowed', type: 'bool' }] },
      } as TypedAbiMap<
        {
          account: string;
          role: number | bigint;
        },
        {
          allowed: boolean;
        }
      >,
    },
    variables: {
      BLACKLISTER_ROLE: {
        name: 'BLACKLISTER_ROLE',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      BURNER_ROLE: {
        name: 'BURNER_ROLE',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      MINTER_ROLE: {
        name: 'MINTER_ROLE',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      OWNER_ROLE: {
        name: 'OWNER_ROLE',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      PERMISSION_DENIED_ERROR: {
        name: 'PERMISSION_DENIED_ERROR',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      RESTRICTION_BLACKLIST: {
        name: 'RESTRICTION_BLACKLIST',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      RESTRICTION_NONE: {
        name: 'RESTRICTION_NONE',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      REVOKER_ROLE: {
        name: 'REVOKER_ROLE',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      deployerPrincipal: {
        name: 'deployer-principal',
        type: 'principal',
        access: 'variable',
      } as TypedAbiVariable<string>,
      isInitialized: {
        name: 'is-initialized',
        type: 'bool',
        access: 'variable',
      } as TypedAbiVariable<boolean>,
      tokenDecimals: {
        name: 'token-decimals',
        type: 'uint128',
        access: 'variable',
      } as TypedAbiVariable<bigint>,
      tokenName: {
        name: 'token-name',
        type: {
          'string-ascii': {
            length: 32,
          },
        },
        access: 'variable',
      } as TypedAbiVariable<string>,
      tokenSymbol: {
        name: 'token-symbol',
        type: {
          'string-ascii': {
            length: 32,
          },
        },
        access: 'variable',
      } as TypedAbiVariable<string>,
      uri: {
        name: 'uri',
        type: {
          'string-utf8': {
            length: 256,
          },
        },
        access: 'variable',
      } as TypedAbiVariable<string>,
    },
    // TODO: fix with clarinet v2
    // constants: undefined,
    constants: {},
    non_fungible_tokens: [],
    fungible_tokens: [{ name: 'wrapped-bitcoin' }],
    epoch: 'Epoch21',
    clarity_version: 'Clarity1',
    contractName: 'Wrapped-Bitcoin',
  },
} as const;

export const accounts = {
  wallet_3: { address: 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC', balance: 0 },
  wallet_6: { address: 'ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0', balance: 0 },
  wallet_1: { address: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5', balance: 0 },
  wallet_5: { address: 'ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB', balance: 0 },
  wallet_7: { address: 'ST3PF13W7Z0RRM42A8VZRVFQ75SV1K26RXEP8YGKJ', balance: 0 },
  wallet_2: { address: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG', balance: 0 },
  faucet: { address: 'STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6', balance: 0 },
  wallet_4: { address: 'ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND', balance: 0 },
  wallet_8: { address: 'ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP', balance: 0 },
  deployer: { address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', balance: 0 },
} as const;

export const identifiers = {
  counter: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.counter',
  ftTrait: 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.ft-trait',
  restrictedTokenTrait: 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.restricted-token-trait',
  tester: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.tester',
  wrappedBitcoin: 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin',
} as const;

export const simnet = {
  accounts,
  contracts,
  identifiers,
} as const;

export const deployments = {
  counter: {
    devnet: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.counter',
    simnet: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.counter',
    testnet: null,
    mainnet: null,
  },
  ftTrait: {
    devnet: 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.ft-trait',
    simnet: 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.ft-trait',
    testnet: null,
    mainnet: null,
  },
  restrictedTokenTrait: {
    devnet: 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.restricted-token-trait',
    simnet: 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.restricted-token-trait',
    testnet: null,
    mainnet: null,
  },
  tester: {
    devnet: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.tester',
    simnet: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.tester',
    testnet: null,
    mainnet: null,
  },
  wrappedBitcoin: {
    devnet: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.Wrapped-Bitcoin',
    simnet: 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin',
    testnet: null,
    mainnet: 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin',
  },
} as const;

export const project = {
  contracts,
  deployments,
} as const;
