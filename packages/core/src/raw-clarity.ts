import { hexToBytes } from 'micro-stacks/common';
import { ClarityAbiType, ClarityAbiTypePrimitive, TypedAbiFunction } from './abi-types';
import {
  isClarityAbiOptional,
  isClarityAbiBuffer,
  isClarityAbiList,
  isClarityAbiPrimitive,
  isClarityAbiResponse,
  isClarityAbiStringAscii,
  isClarityAbiStringUtf8,
  isClarityAbiTuple,
  AbiPrimitiveTo,
  cvToValue,
  ok,
  err,
} from './clarity-types';
import { toCamelCase } from './utils';
import { UnknownArgs } from './factory-types';

function unwrap(input: string, prefix = '') {
  return input.slice(prefix.length + 2, -1);
}

export type RawClarityTypeTo<T extends ClarityAbiType, A = any> = T extends ClarityAbiTypePrimitive
  ? AbiPrimitiveTo<T>
  : A;

export type ResponseType<F extends TypedAbiFunction<UnknownArgs, any>> = F extends TypedAbiFunction<
  infer A,
  infer R
>
  ? R
  : never;

// export function rawClarityToValue<AbiType extends ClarityAbiType>(
//   input: string,
//   type: AbiType
// ): RawClarityTypeTo<AbiType>;
export function rawClarityToValue<T = any>(input: string, type: ClarityAbiType): T;
export function rawClarityToValue<T = any>(input: string, type: ClarityAbiType): T {
  if (isClarityAbiTuple(type)) {
    const decoded = expectTuple(input);
    const tuple: Record<string, any> = {};
    const tupleReduced = Object.entries(decoded).reduce((acc, [key, val]) => {
      const keyFixed = key.trim();
      return {
        ...acc,
        [keyFixed]: val.trim(),
      };
    }, {} as Record<string, any>);
    type.tuple.forEach(({ name, type: _type }) => {
      const camelName = toCamelCase(name);
      tuple[camelName] = rawClarityToValue(tupleReduced[name], _type);
    });
    return tuple as unknown as T;
    // throw new Error("Unable to parse tuple yet.");
  } else if (isClarityAbiList(type)) {
    const elements: string[] = expectList(input);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return elements.map(e => rawClarityToValue(e, type.list.type)) as unknown as T;
    // throw new Error("Unable to parse list");
  } else if (isClarityAbiOptional(type)) {
    if (input === 'none') return null as unknown as T;
    return rawClarityToValue(unwrap(input, 'some'), type.optional);
  } else if (isClarityAbiStringAscii(type)) {
    return input.slice(1, -1) as unknown as T;
  } else if (isClarityAbiStringUtf8(type)) {
    return input.slice(2, -1) as unknown as T;
  } else if (type === 'bool') {
    return (input === 'true') as unknown as T;
  } else if (type === 'uint128') {
    return BigInt(input.slice(1)) as unknown as T;
  } else if (type === 'int128') {
    return BigInt(input) as unknown as T;
  } else if (type === 'trait_reference') {
    return input.replace(/^\'/, '') as unknown as T;
  } else if (type === 'principal') {
    return input.replace(/^\'/, '') as unknown as T;
  } else if (type === 'none') {
    return null as unknown as T;
  } else if (isClarityAbiBuffer(type)) {
    const buff = hexToBytes(input.slice(2));
    return buff as unknown as T;
  } else if (isClarityAbiResponse(type)) {
    if (input.startsWith('(ok')) {
      const inner = unwrap(input, 'ok');
      return ok(rawClarityToValue(inner, type.response.ok)) as unknown as T;
    }
    const inner = unwrap(input, 'err');
    return err(rawClarityToValue(inner, type.response.error)) as unknown as T;
  }
  throw new Error(`Unable to parse cv string to value: ${input} ${JSON.stringify(type, null, 2)}`);
}

function consume(src: string, expectation: string, wrapped: boolean) {
  let dst = (' ' + src).slice(1);
  let size = expectation.length;
  if (!wrapped && src !== expectation) {
    throw new Error(`Expected ${expectation.toString()}, got ${src}`);
  }
  if (wrapped) {
    size += 2;
  }
  if (dst.length < size) {
    throw new Error(`Expected ${expectation.toString()}, got ${src}`);
  }
  if (wrapped) {
    dst = dst.substring(1, dst.length - 1);
  }
  const res = dst.slice(0, expectation.length);
  if (res !== expectation) {
    throw new Error(`Expected ${expectation.toString()}, got ${src}`);
  }
  let leftPad = 0;
  if (dst.charAt(expectation.length) === ' ') {
    leftPad = 1;
  }
  const remainder = dst.substring(expectation.length + leftPad);
  return remainder;
}

function expectOk(input: string) {
  return consume(input, 'ok', true);
}

function expectErr(input: string) {
  return consume(input, 'err', true);
}

function expectSome(input: string) {
  return consume(input, 'some', true);
}

function expectNone(input: string) {
  return consume(input, 'none', false);
}

function expectBool(input: string, value: boolean) {
  try {
    consume(input, `${String(value)}`, false);
  } catch (error) {
    throw error;
  }
  return value;
}

function expectUint(input: string, value: number | bigint): bigint {
  try {
    consume(input, `u${value}`, false);
  } catch (error) {
    throw error;
  }
  return BigInt(value);
}

function expectInt(input: string, value: number | bigint): bigint {
  try {
    consume(input, `${value}`, false);
  } catch (error) {
    throw error;
  }
  return BigInt(value);
}

const byteToHexCache: string[] = new Array(0xff);

for (let n = 0; n <= 0xff; ++n) {
  byteToHexCache[n] = n.toString(16).padStart(2, '0');
}

function buff(val: Uint8Array | string) {
  const buff = typeof val == 'string' ? new TextEncoder().encode(val) : new Uint8Array(val);

  const hexOctets = new Array(buff.length);

  for (let i = 0; i < buff.length; ++i) {
    hexOctets[i] = byteToHexCache[buff[i]];
  }

  return `0x${hexOctets.join('')}`;
}

function expectBuff(input: string, value: Uint8Array) {
  const buffer = buff(value);
  if (input !== buffer) {
    throw new Error(`Expected ${buffer}, gt ${input}`);
  }
  return value;
}

function expectAscii(input: string, value: string) {
  try {
    consume(input, `"${value}"`, false);
  } catch (error) {
    throw error;
  }
  return value;
}

function expectUtf8(input: string, value: string) {
  try {
    consume(input, `u"${value}"`, false);
  } catch (error) {
    throw error;
  }
  return value;
}

function expectPrincipal(input: string, value: string) {
  try {
    consume(input, `${value}`, false);
  } catch (error) {
    throw error;
  }
  return value;
}

function expectList(input: string): string[] {
  if (input.charAt(0) !== '[' || input.charAt(input.length - 1) !== ']') {
    throw new Error(`Expected (list ..), got ${input.toString()}`);
  }

  const stack = [];
  const elements: string[] = [];
  let start = 1;
  for (let i = 0; i < input.length; i++) {
    if (input.charAt(i) === ',' && stack.length == 1) {
      elements.push(input.substring(start, i));
      start = i + 2;
    }
    if (['(', '[', '{'].includes(input.charAt(i))) {
      stack.push(input.charAt(i));
    }
    if (input.charAt(i) === ')' && stack[stack.length - 1] === '(') {
      stack.pop();
    }
    if (input.charAt(i) === '}' && stack[stack.length - 1] === '{') {
      stack.pop();
    }
    if (input.charAt(i) === ']' && stack[stack.length - 1] === '[') {
      stack.pop();
    }
  }
  const remainder = input.substring(start, input.length - 1);
  if (remainder.length > 0) {
    elements.push(remainder);
  }
  return elements;
}

function expectTuple(input: string) {
  if (input.charAt(0) !== '{' || input.charAt(input.length - 1) !== '}') {
    throw new Error(`Expected '(tuple ..)', got ${input.toString()}`);
  }

  let start = 1;
  const stack = [];
  const elements = [];
  for (let i = 0; i < input.length; i++) {
    if (input.charAt(i) === ',' && stack.length == 1) {
      elements.push(input.substring(start, i));
      start = i + 2;
    }
    if (['(', '[', '{'].includes(input.charAt(i))) {
      stack.push(input.charAt(i));
    }
    if (input.charAt(i) === ')' && stack[stack.length - 1] === '(') {
      stack.pop();
    }
    if (input.charAt(i) === '}' && stack[stack.length - 1] === '{') {
      stack.pop();
    }
    if (input.charAt(i) === ']' && stack[stack.length - 1] === '[') {
      stack.pop();
    }
  }
  const remainder = input.substring(start, input.length - 1);
  if (remainder.length > 0) {
    elements.push(remainder);
  }

  const tuple: Record<string, string> = {};
  for (const element of elements) {
    for (let i = 0; i < element.length; i++) {
      if (element.charAt(i) === ':') {
        const key: string = element.substring(0, i);
        const value: string = element.substring(i + 2, element.length);
        tuple[key] = value;
        break;
      }
    }
  }

  return tuple;
}
