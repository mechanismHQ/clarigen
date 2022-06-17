import { SimpleInterface } from './abi/simple';
import { generateContractMeta, serialize } from '../src/generate/single';

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
