const { readFile, writeFile, mkdir } = require('fs/promises');
const { resolve } = require('path');

async function run() {
  const fileContents = await readFile(resolve(__dirname, './dist/index.mjs'), {
    encoding: 'utf-8',
  });
  const declarationContents = await readFile(resolve(__dirname, './dist/index.d.ts'), {
    encoding: 'utf-8',
  });

  const denoFolder = resolve(__dirname, './dist/deno');
  await mkdir(denoFolder, { recursive: true });

  const regex = /micro-stacks\/(\w*)/g;
  const newImport = 'https://deno.land/x/microstacks/$1.js';
  const newFile = fileContents.replace(regex, newImport);
  const filePath = resolve(denoFolder, './index.js');
  const withRef = `/// <reference path="./index.d.ts" />
${newFile}`;
  await writeFile(filePath, withRef, { encoding: 'utf-8' });

  const newDeclaration = declarationContents.replace(regex, newImport);
  await writeFile(resolve(denoFolder, './index.d.ts'), newDeclaration, { encoding: 'utf-8' });
}

run()
  .catch(console.error)
  .finally(() => {
    process.exit();
  });
