/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const semver = require('semver');
const generatorPackage = require(path.join(__dirname, 'package.json'));

const version = generatorPackage.engines.node;
if (!semver.satisfies(process.version, version)) {
  console.error(
    `Node.js version ${version} is required. Installed version ${process.version} is not compatible.`
  );
  process.exit(1);
}

// Detect if running in dev environment.
const tsConfigBuildFile = path.join(__dirname, 'tsconfig.json');
if (fs.existsSync(tsConfigBuildFile)) {
  tsNodeInstall();
} else {
  try {
    require('./dist/direct-install');
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      console.error(
        'Script "./dist/direct-install.js" not found, and dev environment to run "./src/direct-install.ts" not detected.'
      );
    }
    throw e;
  }
}

function tsNodeInstall() {
  function getTsNodePkg() {
    const tsNodePkgName = 'ts-node';
    // Try using the ts-node package version typically specified in env vars by npm.
    const tsNodeDevDep = 'npm_package_devDependencies_ts_node';
    if (process.env && process.env[tsNodeDevDep]) {
      return `${tsNodePkgName}@${process.env[tsNodeDevDep]}`;
    } else {
      // Otherwise, try loading the version from the package.json file.
      try {
        const tsNodePkgJsonVersion = require('./package.json')['devDependencies']['ts-node'];
        return `${tsNodePkgName}@${tsNodePkgJsonVersion}`;
      } catch (err) {
        // ignore
      }
    }
    console.warn('Could not detect ts-node version to use, no version will be specified.');
    return tsNodePkgName;
  }

  const childProcess = require('child_process');
  const directInstallTsFile = path.join(__dirname, 'src', 'direct-install.ts');
  const tsNodeExecArgs = ['ts-node', 'src/direct-install.ts'];
  console.log(`Running: npx ${tsNodeExecArgs.join(' ')}`);
  childProcess.execFileSync('yarn', tsNodeExecArgs, {
    stdio: ['pipe', process.stdout, process.stderr],
    // shell: process.platform == 'win32',
  });
}
