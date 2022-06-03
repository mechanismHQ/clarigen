/* eslint-disable @typescript-eslint/no-var-requires */
const { readFile, writeFile } = require('fs/promises');
const { resolve } = require('path');

async function run() {
  const fileContents = await readFile(resolve(__dirname, './dist/index.mjs'), {
    encoding: 'utf-8',
  });
  const regex = /micro-stacks\/(\w*)/g;
  const newImport = 'https://deno.land/x/microstacks/$1.js';
  const newFile = fileContents.replace(regex, newImport);
  const filePath = resolve(__dirname, './dist/deno.js');
  const withRef = `/// <reference path="./index.d.ts" />
${newFile}`;
  await writeFile(filePath, withRef, { encoding: 'utf-8' });
}

run()
  .catch(console.error)
  .finally(() => {
    process.exit();
  });
