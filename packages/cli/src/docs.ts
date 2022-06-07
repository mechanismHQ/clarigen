import { createContractDocInfo, generateMarkdown } from '@clarigen/claridocs';
import { ClarityAbi } from '@clarigen/core';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { join, relative, resolve } from 'path';

export async function generateMarkdownDoc({
  contractFile,
  contractName,
  docsPath,
  abi,
  dirName,
}: {
  contractFile: string;
  contractName: string;
  docsPath: string;
  abi: ClarityAbi;
  dirName?: string;
}) {
  const contractSrc = await readFile(contractFile, { encoding: 'utf-8' });
  const docs = createContractDocInfo({ contractSrc, abi });
  const folder = resolve(process.cwd(), docsPath, dirName || '.');
  const filePath = resolve(folder, `${contractName}.md`);

  const md = generateMarkdown({
    contract: docs,
    contractFile: relative(folder, contractFile),
    contractName,
    abi,
  });

  await mkdir(folder, { recursive: true });

  await writeFile(filePath, md);
}
