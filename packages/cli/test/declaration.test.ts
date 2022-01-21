import { generateTypesFile, makePureTypes } from '../src';
import { SimpleInterface } from './abi/simple';
import { readFile } from './test-utils';

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

test('can properly name reserved variable named arguments', () => {
  const typings = makePureTypes(SimpleInterface);
  const line = typings.split('\n').find((l) => l.includes('fnWithFor'));
  expect(line).toEqual(
    '  fnWithFor: (_for: boolean) => ContractCalls.ReadOnly<boolean>;'
  );
});

test('can generate map types', () => {
  const typings = makePureTypes(SimpleInterface);
  const line = typings.split('\n').find((l) => l.includes('simpleMap'));
  expect(line).toEqual(
    '  simpleMap: (key: number | bigint) => ContractCalls.Map<number | bigint, boolean>;'
  );
});
