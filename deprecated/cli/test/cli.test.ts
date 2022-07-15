import { generateFilesForContract, generateProject } from '../src/utils';
import { getProjectConfig } from '../src/config';
import { resolve } from 'path';
import { readFile, rm, mkdir } from 'fs/promises';
import { createClarityBin } from '@clarigen/native-bin';

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
  const provider = await createClarityBin();
  await generateFilesForContract({
    contractFile: 'contracts/simple.clar',
    outputFolder: 'tmp/test-1',
    provider,
    contractName: 'simple',
    contractAddress: 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
  });
  expect(await getFile('tmp/test-1/simple/abi.ts')).toBeTruthy();
  expect(await getFile('tmp/test-1/simple/index.ts')).toBeTruthy();
  expect(await getFile('tmp/test-1/simple/types.ts')).toBeTruthy();
});

test('can get a config file', async () => {
  const path = resolve(process.cwd(), 'test/clarinet-project');
  const config = await getProjectConfig(path);
  expect(config.contractsDir).toEqual('clarinet/contracts');
  expect(config.contracts).toBeTruthy();
  const [contract] = config.contracts;
  expect(contract.name).toEqual('echo');
});

test('can generate a clarinet project', async () => {
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
});
