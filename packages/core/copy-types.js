const { cp } = require('fs/promises');
const { resolve } = require('path');

async function run() {
  const [typePath] = process.argv.slice(2);
  const basePath = resolve(process.cwd(), typePath);
  const finalPath = resolve(__dirname, './src/abi-types.ts');
  const result = await cp(basePath, finalPath);
}

run()
  .catch(console.error)
  .finally(() => {
    process.exit();
  });
