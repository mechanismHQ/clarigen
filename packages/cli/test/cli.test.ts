import { generateFilesForContract, generateProject } from '../src/utils';
import { getConfigFile } from '../src/config';
import { resolve } from 'path';
import { readFile, rm, mkdir } from 'fs/promises';

const getFile = async (path: string) => {
  const fullPath = resolve(process.cwd(), path);
  const contents = await readFile(fullPath, { encoding: 'utf-8' });
  return contents;
};

async function rmdir(path: string) {
  try {
    await rm(path, { recursive: true });
  } catch {}
}

test('generates files appropriately', async () => {
  await rmdir(resolve(process.cwd(), 'tmp'));
  await mkdir(resolve(process.cwd(), 'tmp'));
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
  const outputDir = resolve(path, 'clarigen');
  await rmdir(outputDir);
  await generateProject(path);
  expect(
    await getFile('test/sample-project/clarigen/trait/index.ts')
  ).toBeTruthy();
  expect(
    await getFile('test/sample-project/clarigen/trait/abi.ts')
  ).toBeTruthy();
  expect(
    await getFile('test/sample-project/clarigen/trait/types.ts')
  ).toBeTruthy();
  expect(
    await getFile('test/sample-project/clarigen/test-project/index.ts')
  ).toBeTruthy();
  expect(
    await getFile('test/sample-project/clarigen/test-project/abi.ts')
  ).toBeTruthy();
  expect(
    await getFile('test/sample-project/clarigen/test-project/types.ts')
  ).toBeTruthy();
  expect(await getFile('test/sample-project/clarigen/index.ts')).toBeTruthy();
});

test('can generate a clarion project', async () => {
  const path = resolve(process.cwd(), 'test/clarinet-project');
  const outputDir = resolve(path, 'clarigen');
  await rmdir(outputDir);
  await generateProject(path);

  expect(
    await getFile('test/clarinet-project/clarigen/echo/index.ts')
  ).toBeTruthy();
  expect(
    await getFile('test/clarinet-project/clarigen/echo/abi.ts')
  ).toBeTruthy();
  expect(
    await getFile('test/clarinet-project/clarigen/echo/types.ts')
  ).toBeTruthy();
  expect(
    await getFile('test/clarinet-project/clarigen/nested/nested/index.ts')
  ).toBeTruthy();
  expect(
    await getFile('test/clarinet-project/clarigen/nested/nested/abi.ts')
  ).toBeTruthy();
  expect(
    await getFile('test/clarinet-project/clarigen/nested/nested/types.ts')
  ).toBeTruthy();
  expect(await getFile('test/sample-project/clarigen/index.ts')).toBeTruthy();
});
