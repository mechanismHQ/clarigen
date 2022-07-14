import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { createContractDocInfo, generateMarkdown } from '../src';
import { DocTestContractInterface } from './clarinet-project/clarigen/doc-test-contract/abi';

const basePath = resolve(__dirname, 'clarinet-project');
const filePath = resolve(basePath, 'contracts/doc-test-contract.clar');

function getContractSrc() {
  return readFile(filePath, { encoding: 'utf-8' });
}

test('testing', async () => {
  const contractSrc = await getContractSrc();
  const result = createContractDocInfo({ contractSrc, abi: DocTestContractInterface });
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

test('can create markdown', async () => {
  const contractSrc = await getContractSrc();
  const contract = createContractDocInfo({ contractSrc, abi: DocTestContractInterface });

  const markdown = generateMarkdown({
    contract,
    abi: DocTestContractInterface,
    contractFile: filePath,
    contractName: 'doc-test-contract',
  });

  // console.log('markdown', markdown);
});
