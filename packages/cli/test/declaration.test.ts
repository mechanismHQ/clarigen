import { generateTypesFile, makePureTypes } from '../src';
import { appmap } from './abi/appmap';
import { SimpleInterface } from './abi/simple';
import { readFile } from './test-utils';

test('can gen', () => {
  const typesFile = generateTypesFile(appmap, 'app-map');
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

test('can generate pure typings', () => {
  const typings = makePureTypes(SimpleInterface);
  const [line] = typings.split('\n');
  expect(line).toEqual('  getName: () => ContractCalls.Public<string, null>;');
});
