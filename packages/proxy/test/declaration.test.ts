import { generateTypesFile } from '@clarion/proxy';
import { appmap } from './contracts/appmap/abi';
import { pox } from './contracts/pox/abi';
import { SimpleInterface } from './contracts/simple/abi';
import { readFile } from './test-utils';

test('can gen', () => {
  const typesFile = generateTypesFile(appmap, 'app-map');
  expect(typesFile).toBeTruthy();
});

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
