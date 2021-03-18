import { generateFilesForContract } from '../src/utils';
import { resolve } from 'path';
import { readFile } from 'fs/promises';

const getFile = async (path: string) => {
  const fullPath = resolve(process.cwd(), path);
  const contents = await readFile(fullPath, { encoding: 'utf-8' });
  return contents;
};

jest.mock('@clarion/proxy', () => {
  return {
    generateIndexFile: () => 'Index file',
    generateInterface: () => 'Interface',
    generateInterfaceFile: () => 'Interface file',
    makeTypes: () => 'Type file',
    getContractNameFromPath: () => 'contract',
  };
});

test('generates files appropriately', async () => {
  await generateFilesForContract({
    contractFile: 'contracts/simple.clar',
    outputFolder: 'tmp/test-1',
  });
  const abiFile = await getFile('tmp/test-1/abi.ts');
  expect(abiFile).toEqual('Interface file');
  expect(await getFile('tmp/test-1/index.ts')).toEqual('Index file');
  expect(await getFile('tmp/test-1/types.ts')).toEqual('Type file');
});
