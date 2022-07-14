import { SimpleInterface } from './abi/simple';
import { generateContractMeta, serialize } from '../src/generate/single';
import { toCamelCase, TypedAbiVariable } from '@clarigen/core';

test('can generate single file', () => {
  const code = generateContractMeta({
    abi: SimpleInterface,
    contractFile: '',
    contractName: 'simple',
    dirName: '',
    contractAddress: '',
    variables: [],
  });
  // console.log(code);
});

test('serializing big items', () => {
  const array: boolean[] = [];
  for (let i = 0; i < 1000; i++) {
    array.push(true);
  }
  const serialized = serialize(array);
  expect(serialized.includes('more items')).toBe(false);
});

test('serializing constants', async () => {
  const array: boolean[] = [];
  for (let i = 0; i < 1000; i++) {
    array.push(true);
  }
  const constant: TypedAbiVariable<boolean[]> = {
    type: 'bool',
    name: 'my-bool',
    access: 'constant',
    defaultValue: array,  
  }
  const line = `"${toCamelCase(constant.name)}": ${serialize(
    constant.defaultValue
  )}`
  console.log(line);
  expect(line.includes('more items')).toBeFalsy();
});
