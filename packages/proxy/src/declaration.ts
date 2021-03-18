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
import { toCamelCase } from './utils';

export const cvFromType = (val: ClarityAbiType) => {
  if (isClarityAbiPrimitive(val)) {
    if (val === 'uint128') {
      return 'ClarityTypes.UIntCV';
    } else if (val === 'int128') {
      return 'ClarityTypes.IntCV';
    } else if (val === 'bool') {
      return 'ClarityTypes.BooleanCV';
    } else if (val === 'principal') {
      return 'ClarityTypes.PrincipalCV';
    } else if (val === 'none') {
      return 'ClarityTypes.NoneCV';
    } else {
      throw new Error(`Unexpected Clarity ABI type primitive: ${JSON.stringify(val)}`);
    }
  } else if (isClarityAbiBuffer(val)) {
    return 'ClarityTypes.BufferCV';
  } else if (isClarityAbiResponse(val)) {
    return 'ClarityTypes.ResponseCV';
  } else if (isClarityAbiOptional(val)) {
    return 'ClarityTypes.OptionalCV';
  } else if (isClarityAbiTuple(val)) {
    return 'ClarityTypes.TupleCV';
  } else if (isClarityAbiList(val)) {
    return 'ClarityTypes.ListCV';
  } else if (isClarityAbiStringAscii(val)) {
    return 'ClarityTypes.StringAsciiCV';
  } else if (isClarityAbiStringUtf8(val)) {
    return 'ClarityTypes.StringUtf8CV';
  } else {
    throw new Error(`Unexpected Clarity ABI type: ${JSON.stringify(val)}`);
  }
};

export const makeTypes = (abi: ClarityAbi, contractName: string) => {
  const name = toCamelCase(contractName, true);
  let typings = `interface ${name}Contract {`;
  abi.functions.forEach(func => {
    if (func.access === 'private') return;
    let functionLine = `${toCamelCase(func.name)}: `;
    const args = func.args.map(arg => {
      return `${toCamelCase(arg.name)}: string`;
    });
    functionLine += `(${args.join(', ')}) => `;
    if (func.access === 'public') {
      const { type } = func.outputs;
      if (!isClarityAbiResponse(type))
        throw new Error('Expected response type for public function');
      functionLine += 'Transaction';
      const ok = cvFromType(type.response.ok);
      const err = cvFromType(type.response.error);
      functionLine += `<${ok}, ${err}>;`;
    } else {
      const type = cvFromType(func.outputs.type);
      functionLine += `Promise<${type}>;`;
    }
    typings += `\n  ${functionLine}`;
  });
  typings += '\n}';

  const fileContents = `import { ClarityTypes, Transaction } from '@clarion/proxy';

export ${typings}
`;
  // console.log(fileContents);
  return fileContents;
};
