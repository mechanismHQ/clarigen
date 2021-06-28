import { generateTypesFile } from '../src';
import { pox } from './abi/pox';
import { SimpleInterface } from './abi/simple';
import { readFile } from './test-utils';

test('generate pox interface', () => {
  const typesFile = generateTypesFile(pox, 'pox');
  expect(typesFile).toBeTruthy();
});

test('generate simple interface', () => {
  const typesFile = generateTypesFile(SimpleInterface, 'simple');
  expect(typesFile).toBeTruthy();
});

test('Can generate the TS declaration for simple.clar', async () => {
  const declarationFile = generateTypesFile(SimpleInterface, 'simple');
  const expectedFile = await readFile('./contracts/simple/types.ts');
  expect(declarationFile).toEqual(expectedFile);
});
