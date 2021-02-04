import {
  ClarityAbi,
  ClarityAbiType,
  isClarityAbiBuffer,
  isClarityAbiList,
  isClarityAbiOptional,
  isClarityAbiPrimitive,
  isClarityAbiResponse,
  isClarityAbiStringAscii,
  isClarityAbiStringUtf8,
  isClarityAbiTuple,
} from '@stacks/transactions';
import { toCamelCase } from './index';

export const cvFromType = (val: ClarityAbiType) => {
  if (isClarityAbiPrimitive(val)) {
    if (val === 'uint128') {
      return 'UIntCV';
    } else if (val === 'int128') {
      return 'IntCV';
    } else if (val === 'bool') {
      return 'BooleanCV';
    } else if (val === 'principal') {
      return 'PrincipalCV';
    } else if (val === 'none') {
      return 'NoneCV';
    } else {
      throw new Error(`Unexpected Clarity ABI type primitive: ${JSON.stringify(val)}`);
    }
  } else if (isClarityAbiBuffer(val)) {
    return 'BufferCV';
  } else if (isClarityAbiResponse(val)) {
    return 'ResponseCV';
  } else if (isClarityAbiOptional(val)) {
    return 'OptionalCV';
  } else if (isClarityAbiTuple(val)) {
    return 'TupleCV';
  } else if (isClarityAbiList(val)) {
    return 'ListCV';
  } else if (isClarityAbiStringAscii(val)) {
    return 'StringAsciiCV';
  } else if (isClarityAbiStringUtf8(val)) {
    return 'StringUtf8CV';
  } else {
    throw new Error(`Unexpected Clarity ABI type: ${JSON.stringify(val)}`);
  }
};

export const makeTypes = (abi: ClarityAbi, contractName: string) => {
  const name = toCamelCase(contractName);
  let typings = `interface ${name[0].toUpperCase()}${name.slice(1)}Contract {`;
  abi.functions.forEach(func => {
    if (func.access === 'private') return;
    let functionLine = `${toCamelCase(func.name)}: `;
    const args = func.args.map(arg => {
      return `${toCamelCase(arg.name)}: string`;
    });
    functionLine += `(${args.join(', ')}) => `;
    if (func.access === 'public') {
      functionLine += 'Transaction;';
    } else {
      const type = cvFromType(func.outputs.type);
      functionLine += `Promise<${type}>;`;
    }
    typings += `\n  ${functionLine}`;
  });
  typings += '\n}';
  console.log(typings);
};
