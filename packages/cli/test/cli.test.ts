import { generateFilesForContract, generateProject } from '../src/utils';
import { getConfigFile } from '../src/config';
import { resolve } from 'path';
import { readFile, rmdir } from 'fs/promises';

const getFile = async (path: string) => {
  const fullPath = resolve(process.cwd(), path);
  const contents = await readFile(fullPath, { encoding: 'utf-8' });
  return contents;
};

test('generates files appropriately', async () => {
  await rmdir(resolve(process.cwd(), 'tmp/test-1'), { recursive: true });
  await generateFilesForContract({
    contractFile: 'contracts/simple.clar',
    outputFolder: 'tmp/test-1',
  });
  expect(await getFile('tmp/test-1/simple/abi.ts')).toBeTruthy();
  expect(await getFile('tmp/test-1/simple/index.ts')).toBeTruthy();
  expect(await getFile('tmp/test-1/simple/types.ts')).toBeTruthy();
});

test('can get a config file', async () => {
  const path = resolve(process.cwd(), 'test/sample-project');
  const config = await getConfigFile(path);
  expect(config.contractsDir).toEqual('contracts');
  expect(config.contracts).toBeTruthy();
});

test('can generate a project', async () => {
  const path = resolve(process.cwd(), 'test/sample-project');
  const outputDir = resolve(path, 'clarion');
  await rmdir(outputDir, { recursive: true });
  await generateProject(path);
  expect(
    await getFile('test/sample-project/clarion/trait/index.ts')
  ).toBeTruthy();
  expect(
    await getFile('test/sample-project/clarion/trait/abi.ts')
  ).toBeTruthy();
  expect(
    await getFile('test/sample-project/clarion/trait/types.ts')
  ).toBeTruthy();
  expect(
    await getFile('test/sample-project/clarion/test-project/index.ts')
  ).toBeTruthy();
  expect(
    await getFile('test/sample-project/clarion/test-project/abi.ts')
  ).toBeTruthy();
  expect(
    await getFile('test/sample-project/clarion/test-project/types.ts')
  ).toBeTruthy();
});
