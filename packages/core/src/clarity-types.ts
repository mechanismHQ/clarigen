import type * as Clarity from '@stacks/transactions';
import {
  addressToString,
  ClarityAbi as _ClarityAbi,
  ClarityAbiType,
  ClarityAbiTypeTuple,
  ClarityType,
  ClarityValue,
  PrincipalCV,
  getTypeString,
  uintCV,
  standardPrincipalCV,
  contractPrincipalCV,
  intCV,
  trueCV,
  falseCV,
  isClarityAbiPrimitive,
  isClarityAbiBuffer,
  isClarityAbiList,
  isClarityAbiOptional,
  isClarityAbiResponse,
  isClarityAbiStringAscii,
  isClarityAbiStringUtf8,
  isClarityAbiTuple,
  bufferCVFromString,
  stringAsciiCV,
  stringUtf8CV,
  noneCV,
  someCV,
  tupleCV,
  listCV,
  parseToCV as _parseToCV,
} from '@stacks/transactions';
import { Result } from 'neverthrow';

export interface ClarityAbiMap {
  name: string;
  key:
    | {
        name: string;
        type: ClarityAbiType;
      }[]
    | ClarityAbiTypeTuple
    | ClarityAbiType;
  value:
    | {
        name: string;
        type: ClarityAbiType;
      }[]
    | ClarityAbiTypeTuple
    | ClarityAbiType;
}

export interface ClarityAbi extends Omit<_ClarityAbi, 'maps'> {
  maps: ClarityAbiMap[];
  clarity_version?: string;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ClarityTypes {
  export type BooleanCV = Clarity.BooleanCV;
  export type TrueCV = Clarity.TrueCV;
  export type FalseCV = Clarity.FalseCV;
  export type IntCV = Clarity.IntCV;
  export type UIntCV = Clarity.UIntCV;
  export type BufferCV = Clarity.BufferCV;
  export type OptionalCV = Clarity.OptionalCV;
  export type NoneCV = Clarity.NoneCV;
  export type SomeCV = Clarity.SomeCV;
  export type ResponseCV = Clarity.ResponseCV;
  export type ResponseOkCV = Clarity.ResponseOkCV;
  export type ResponseErrorCV = Clarity.ResponseErrorCV;
  export type PrincipalCV = Clarity.PrincipalCV;
  export type StandardPrincipalCV = Clarity.StandardPrincipalCV;
  export type ContractPrincipalCV = Clarity.ContractPrincipalCV;
  export type ListCV = Clarity.ListCV;
  export type TupleCV = Clarity.TupleCV;
  export type StringAsciiCV = Clarity.StringAsciiCV;
  export type StringUtf8CV = Clarity.StringUtf8CV;
  export type Response<Ok, Err> = Result<Ok, Err>;
}

function principalToString(principal: PrincipalCV): string {
  if (principal.type === ClarityType.PrincipalStandard) {
    return addressToString(principal.address);
  } else if (principal.type === ClarityType.PrincipalContract) {
    const address = addressToString(principal.address);
    return `${address}.${principal.contractName.content}`;
  } else {
    throw new Error(`Unexpected principal data: ${JSON.stringify(principal)}`);
  }
}

export function cvToValue(val: ClarityValue): any {
  switch (val.type) {
    case ClarityType.BoolTrue:
      return true;
    case ClarityType.BoolFalse:
      return false;
    case ClarityType.Int:
      return val.value;
    case ClarityType.UInt:
      return val.value;
    case ClarityType.Buffer:
      return val.buffer;
    case ClarityType.OptionalNone:
      return null;
    case ClarityType.OptionalSome:
      return cvToValue(val.value);
    case ClarityType.ResponseErr:
      return cvToValue(val.value);
    case ClarityType.ResponseOk:
      return cvToValue(val.value);
    case ClarityType.PrincipalStandard:
    case ClarityType.PrincipalContract:
      return principalToString(val);
    case ClarityType.List:
      return val.list.map(v => cvToValue(v));
    case ClarityType.Tuple:
      const result: { [key: string]: any } = {};
      Object.keys(val.data).forEach(key => {
        result[key] = cvToValue(val.data[key]);
      });
      return result;
    case ClarityType.StringASCII:
      return val.data;
    case ClarityType.StringUTF8:
      return val.data;
  }
}

type TupleInput = Record<string, any>;
type CVInput = string | boolean | TupleInput | number | bigint;

function inputToBigInt(input: CVInput) {
  const isBigInt = typeof input === 'bigint';
  const isNumber = typeof input === 'number';
  const isString = typeof input === 'string';
  const isOk = isBigInt || isNumber || isString;
  if (!isOk) {
    throw new Error('Invalid input type for integer');
  }
  return BigInt(input);
}

export function parseToCV(input: CVInput, type: ClarityAbiType): ClarityValue {
  if (isClarityAbiTuple(type)) {
    if (typeof input !== 'object') {
      throw new Error('Invalid tuple input');
    }
    const tuple: Record<string, ClarityValue> = {};
    type.tuple.forEach(key => {
      const val = input[key.name];
      tuple[key.name] = parseToCV(val, key.type);
    });
    return tupleCV(tuple);
  } else if (isClarityAbiList(type)) {
    const inputs = input as any[];
    const values = inputs.map(input => {
      return parseToCV(input, type.list.type);
    });
    return listCV(values);
  } else if (isClarityAbiOptional(type)) {
    if (!input) return noneCV();
    return someCV(parseToCV(input, type.optional));
  } else if (isClarityAbiStringAscii(type)) {
    if (typeof input !== 'string') {
      throw new Error('Invalid string-ascii input');
    }
    return stringAsciiCV(input);
  } else if (isClarityAbiStringUtf8(type)) {
    if (typeof input !== 'string') {
      throw new Error('Invalid string-ascii input');
    }
    return stringUtf8CV(input);
  } else if (type === 'bool') {
    const inputString = typeof input === 'boolean' ? input.toString() : input;
    return _parseToCV(inputString as string, type);
  } else if (type === 'uint128') {
    const bigi = inputToBigInt(input);
    return uintCV(bigi.toString());
  } else if (type === 'int128') {
    const bigi = inputToBigInt(input);
    return intCV(bigi.toString());
  } else if (type === 'trait_reference') {
    if (typeof input !== 'string') throw new Error('Invalid input for trait_reference');
    const [addr, name] = input.split('.');
    return contractPrincipalCV(addr, name);
  }
  return _parseToCV(input as string, type);
}

export function cvToString(val: ClarityValue, encoding: 'tryAscii' | 'hex' = 'hex'): string {
  switch (val.type) {
    case ClarityType.BoolTrue:
      return 'true';
    case ClarityType.BoolFalse:
      return 'false';
    case ClarityType.Int:
      return val.value.toString();
    case ClarityType.UInt:
      return `u${val.value.toString()}`;
    case ClarityType.Buffer:
      if (encoding === 'tryAscii') {
        const str = val.buffer.toString('ascii');
        if (/[ -~]/.test(str)) {
          return JSON.stringify(str);
        }
      }
      return `0x${val.buffer.toString('hex')}`;
    case ClarityType.OptionalNone:
      return 'none';
    case ClarityType.OptionalSome:
      return `(some ${cvToString(val.value, encoding)})`;
    case ClarityType.ResponseErr:
      return `(err ${cvToString(val.value, encoding)})`;
    case ClarityType.ResponseOk:
      return `(ok ${cvToString(val.value, encoding)})`;
    case ClarityType.PrincipalStandard:
    case ClarityType.PrincipalContract:
      return `'${principalToString(val)}`;
    case ClarityType.List:
      return `(list ${val.list.map(v => cvToString(v, encoding)).join(' ')})`;
    case ClarityType.Tuple:
      return `(tuple ${Object.keys(val.data)
        .map(key => `(${key} ${cvToString(val.data[key], encoding)})`)
        .join(' ')})`;
    case ClarityType.StringASCII:
      return `"${val.data}"`;
    case ClarityType.StringUTF8:
      return `u"${val.data}"`;
  }
}
