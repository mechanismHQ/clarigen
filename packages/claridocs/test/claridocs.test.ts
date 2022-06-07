import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { createContractDocInfo } from '../src';
import { DocTestContractInterface } from './clarinet-project/clarigen/doc-test-contract/abi';

const basePath = resolve(__dirname, 'clarinet-project');
const filePath = resolve(basePath, 'contracts/doc-test-contract.clar');

test('testing', async () => {
  const contractSrc = await readFile(filePath, { encoding: 'utf-8' });
  const result = createContractDocInfo({ contractSrc, abi: DocTestContractInterface });
  console.log('result', result);
  const { functions, comments } = result;
  expect(functions.length).toEqual(DocTestContractInterface.functions.length);
  expect(comments.length).toEqual(2);

  const expectedComments = contractSrc
    .split('\n')
    .slice(0, 2)
    .map(l => {
      return l.slice(3);
    });
  expect(comments).toEqual(expectedComments);
});
