import { isClarityAbiResponse, isClarityAbiStringAscii } from '@stacks/transactions';
import { generateIndexFile, generateInterface, generateInterfaceFile } from '@clarion/proxy';
import { readFile as readFileFn } from 'fs';
import { promisify } from 'util';
import { resolve } from 'path';

const readFile = promisify(readFileFn);

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
  const abiPath = resolve(__dirname, './mocks/abi.txt');
  const expectedFile = await readFile(abiPath, { encoding: 'utf-8' });
  const fileContents = await generateInterfaceFile({
    contractFile: 'test/contracts/simple/simple.clar',
  });
  expect(fileContents).toEqual(expectedFile);
});

test('can generate index file', async () => {
  const indexPath = resolve(__dirname, './contracts/simple/index.ts');
  const expectedFile = await readFile(indexPath, { encoding: 'utf-8' });
  const indexFile = generateIndexFile({ contractFile: 'test/contracts/simple/simple.clar' });
  expect(indexFile).toEqual(expectedFile);
});
