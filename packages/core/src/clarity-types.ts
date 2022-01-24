import {
  addressToString,
  ClarityAbi as _ClarityAbi,
  ClarityAbiType,
  ClarityAbiTypeTuple,
  ClarityType,
  ClarityValue,
  PrincipalCV,
  uintCV,
  contractPrincipalCV,
  intCV,
  stringAsciiCV,
  stringUtf8CV,
  noneCV,
  someCV,
  tupleCV,
  listCV,
  cvToJSON,
  hexToCV,
  ClarityAbiFunction,
  bufferCV,
} from 'micro-stacks/clarity';
import {
  isClarityAbiList,
  isClarityAbiOptional,
  isClarityAbiStringAscii,
  isClarityAbiStringUtf8,
  isClarityAbiTuple,
  isClarityAbiBuffer,
  parseToCV as _parseToCV,
} from 'micro-stacks/transactions';
import { bytesToAscii, bytesToHex } from 'micro-stacks/common';
import { ok, err, Result } from 'neverthrow';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ClarityTypes {
  export type Response<Ok, Err> = Result<Ok, Err>;
}

export interface ClarityAbiMap {
  name: string;
  key: ClarityAbiType;
  value: ClarityAbiType;
}

export interface ClarityAbi extends Omit<_ClarityAbi, 'maps'> {
  maps: ClarityAbiMap[];
  clarity_version?: string;
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

/**
 * @param val - ClarityValue
 * @param returnResponse - if true, this will return a "response" object from the `neverthrow`
 * library. Otherwise, it returns the inner value of the response (whether ok or err)
 */
export function cvToValue<T = any>(val: ClarityValue, returnResponse = false): T {
  switch (val.type) {
    case ClarityType.BoolTrue:
      return (true as unknown) as T;
    case ClarityType.BoolFalse:
      return (false as unknown) as T;
    case ClarityType.Int:
    case ClarityType.UInt:
      return (val.value as unknown) as T;
    case ClarityType.Buffer:
      return (val.buffer as unknown) as T;
    case ClarityType.OptionalNone:
      return (null as unknown) as T;
    case ClarityType.OptionalSome:
      return cvToValue(val.value);
    case ClarityType.ResponseErr:
      if (returnResponse) return (err(cvToValue(val.value)) as unknown) as T;
      return cvToValue(val.value);
    case ClarityType.ResponseOk:
      if (returnResponse) return (ok(cvToValue(val.value)) as unknown) as T;
      return cvToValue(val.value);
    case ClarityType.PrincipalStandard:
    case ClarityType.PrincipalContract:
      return (principalToString(val) as unknown) as T;
    case ClarityType.List:
      return (val.list.map(v => cvToValue(v)) as unknown) as T;
    case ClarityType.Tuple:
      const result: { [key: string]: any } = {};
      const arr = Object.keys(val.data).map(key => {
        return [key, cvToValue(val.data[key])];
      });
      arr.forEach(([key, value]) => {
        result[key] = value;
      });
      return result as T;
    case ClarityType.StringASCII:
      return (val.data as unknown) as T;
    case ClarityType.StringUTF8:
      return (val.data as unknown) as T;
  }
}

/**
 * Converts a hex encoded string to the javascript clarity value object {type: string; value: any}
 * @param hex - the hex encoded string with or without `0x` prefix
 * @param jsonCompat - enable to serialize bigints to strings
 */
export function hexToCvValue<T>(hex: string, jsonCompat = false) {
  return cvToValue(hexToCV(hex), jsonCompat);
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
  } else if (isClarityAbiBuffer(type)) {
    return bufferCV(input as Uint8Array);
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
        const str = bytesToAscii(val.buffer);
        if (/[ -~]/.test(str)) {
          return JSON.stringify(str);
        }
      }
      return `0x${bytesToHex(val.buffer)}`;
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

export function transformArgsToCV(func: ClarityAbiFunction, args: any[]): ClarityValue[] {
  return args.map((arg, index) => parseToCV(arg, func.args[index].type));
}

export function expectOk<Ok>(response: ClarityTypes.Response<Ok, any>): Ok {
  return response.match(
    ok => ok,
    err => {
      throw new Error(`Expected OK, received error: ${err}`);
    }
  );
}

export function expectErr<Err>(response: ClarityTypes.Response<any, Err>): Err {
  return response.match(
    ok => {
      throw new Error(`Expected Err, received Ok: ${ok}`);
    },
    err => err
  );
}
