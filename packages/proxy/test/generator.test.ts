import { isClarityAbiResponse, isClarityAbiStringAscii } from '@stacks/transactions';
import { generateIndexFile, generateInterface, generateInterfaceFile } from '@clarion/proxy';
import { readFile } from './test-utils';

test('can generate an interface', async () => {
  const abi = await generateInterface({
    contractFile: 'test/contracts/simple/simple.clar',
  });
  const getNameFn = abi.functions.find(func => {
    return func.name === 'get-name';
  });
  if (!getNameFn) throw new Error('Expected get-name fn');
  expect(getNameFn).toBeTruthy();
  expect(getNameFn.args.length).toEqual(0);
  const { type } = getNameFn.outputs;
  if (!isClarityAbiResponse(type)) throw new Error('Expected response type');
  const { ok } = type.response;
  if (!isClarityAbiStringAscii(ok)) throw new Error('Expected string-ascii result');
});

test('can generate interface file', async () => {
  const expectedFile = await readFile('./mocks/abi.txt');
  const contractFile = 'test/contracts/simple/simple.clar';
  const abi = await generateInterface({
    contractFile,
  });
  const fileContents = generateInterfaceFile({
    contractFile,
    abi,
  });
  expect(fileContents).toEqual(expectedFile);
});

test('can generate index file', async () => {
  const expectedFile = await readFile('./contracts/simple/index.ts');
  const indexFile = generateIndexFile({ contractFile: 'test/contracts/simple/simple.clar' });
  expect(indexFile).toEqual(expectedFile);
});
