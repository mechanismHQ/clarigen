/* eslint-disable @typescript-eslint/no-var-requires */
const { cp } = require('fs/promises');
const { resolve } = require('path');

async function run() {
  const basePath = resolve(__dirname, '../core/src/abi-types.ts');
  const finalPath = resolve(__dirname, './dist/abi-types.ts.txt');
  const result = await cp(basePath, finalPath);
}

run()
  .catch(console.error)
  .finally(() => {
    process.exit();
  });
