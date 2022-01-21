import {
  isClarityAbiBuffer,
  isClarityAbiList,
  isClarityAbiOptional,
  isClarityAbiPrimitive,
  isClarityAbiResponse,
  isClarityAbiStringAscii,
  isClarityAbiStringUtf8,
  isClarityAbiTuple,
} from 'micro-stacks/transactions';
import { ClarityAbiFunction, ClarityAbiType } from 'micro-stacks/clarity';
import { toCamelCase, ClarityAbi } from '@clarigen/core';
import { check } from 'reserved-words';

export const jsTypeFromAbiType = (
  val: ClarityAbiType,
  isArgument = false
): string => {
  if (isClarityAbiPrimitive(val)) {
    if (val === 'uint128') {
      if (isArgument) return 'number | bigint';
      return 'bigint';
    } else if (val === 'int128') {
      if (isArgument) return 'number | bigint';
      return 'bigint';
    } else if (val === 'bool') {
      return 'boolean';
    } else if (val === 'principal') {
      return 'string';
    } else if (val === 'none') {
      return 'null';
    } else if (val === 'trait_reference') {
      return 'string';
    } else {
      throw new Error(
        `Unexpected Clarity ABI type primitive: ${JSON.stringify(val)}`
      );
    }
  } else if (isClarityAbiBuffer(val)) {
    return 'Uint8Array';
  } else if (isClarityAbiResponse(val)) {
    const ok: any = jsTypeFromAbiType(val.response.ok);
    const err: any = jsTypeFromAbiType(val.response.error);
    return `ClarityTypes.Response<${ok}, ${err}>`;
  } else if (isClarityAbiOptional(val)) {
    const innerType = jsTypeFromAbiType(val.optional);
    return `${innerType} | null`;
  } else if (isClarityAbiTuple(val)) {
    const tupleDefs: string[] = [];
    val.tuple.forEach(({ name, type }) => {
      const innerType = jsTypeFromAbiType(type);
      tupleDefs.push(`"${name}": ${innerType}`);
    });
    return `{
  ${tupleDefs.join(';\n  ')}
    }`;
  } else if (isClarityAbiList(val)) {
    const innerType: any = jsTypeFromAbiType(val.list.type);
    return `${innerType}[]`;
  } else if (isClarityAbiStringAscii(val)) {
    return 'string';
  } else if (isClarityAbiStringUtf8(val)) {
    return 'string';
  } else if (val === 'trait_reference') {
    return 'string';
  } else {
    throw new Error(`Unexpected Clarity ABI type: ${JSON.stringify(val)}`);
  }
};

// Check if it's a reserved word, and then camelCase
function getArgName(name: string) {
  const camel = toCamelCase(name);
  const prefix = check(camel, 6) ? '_' : '';
  return `${prefix}${camel}`;
}

const accessToReturnType = {
  public: 'Public',
  read_only: 'ReadOnly',
  private: 'Private',
} as const;

export function makePureTypes(abi: ClarityAbi) {
  let typings = '';
  abi.functions.forEach((func, index) => {
    let functionLine = `${toCamelCase(func.name)}: `;
    const args = func.args.map((arg) => {
      return `${getArgName(arg.name)}: ${jsTypeFromAbiType(arg.type, true)}`;
    });
    functionLine += `(${args.join(', ')}) => `;
    const funcType = accessToReturnType[func.access];
    functionLine += `ContractCalls.${funcType}<`;
    if (func.access === 'public') {
      const { type } = func.outputs;
      if (!isClarityAbiResponse(type))
        throw new Error('Expected response type for public function');
      const ok = jsTypeFromAbiType(type.response.ok);
      const err = jsTypeFromAbiType(type.response.error);
      functionLine += `${ok}, ${err}>;`;
    } else {
      const returnType = jsTypeFromAbiType(func.outputs.type);
      functionLine += `${returnType}>;`;
    }
    typings += `${index === 0 ? '' : '\n'}  ${functionLine}`;
  });
  abi.maps.forEach((map) => {
    let functionLine = `${toCamelCase(map.name)}: `;
    const keyType = jsTypeFromAbiType(map.key, true);
    const arg = `key: ${keyType}`;
    const valType = jsTypeFromAbiType(map.value);
    functionLine += `(${arg}) => ContractCalls.Map<${keyType}, ${valType}>;`;
    typings += `\n  ${functionLine}`;
  });
  return typings;
}
