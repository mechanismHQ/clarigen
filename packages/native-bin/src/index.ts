import path from 'path';
import fs from 'fs';
import { getExecutableFileName, getTempFilePath, moveFromPath, verifyOutputFile } from './fs-util';
import { Logger, ConsoleLogger } from './logger';
import { fetchDistributable, getDownloadUrl } from './fetch-dist';
import { NativeClarityBinProvider } from './provider';
export { NativeClarityBinProvider } from './provider';
export { getTempFilePath } from './fs-util';

/**
 * Should correspond to both a git tag on the blockstack-core repo and a
 * set of clarity-binary distributables uploaded to the cloud storage endpoint.
 */
export const CORE_SDK_TAG = '2.0.11.3.0';

export const BLOCKSTACK_CORE_SOURCE_PATH_ENV_VAR = 'BLOCKSTACK_CORE_SOURCE_PATH';
export const CLARITY_CLI_SOURCE_PATH = 'CLARITY_CLI_SOURCE_PATH';

/**
 * A git tag or branch name can be specified as an env var.
 * See [[BLOCKSTACK_CORE_SOURCE_TAG_ENV_VAR]] and [[BLOCKSTACK_CORE_SOURCE_BRANCH_ENV_VAR]].
 * @returns If an environment var is specified then returns the tag/branch string value.
 * Otherwise returns false.
 */
function getOverriddenCoreSource(): string | undefined {
  const oldEnv = process.env[BLOCKSTACK_CORE_SOURCE_PATH_ENV_VAR];
  const env = process.env[CLARITY_CLI_SOURCE_PATH] || oldEnv;
  if (env) return env;
  return;
}

/**
 * Resolve the directory of the currently executing package
 * @see https://stackoverflow.com/a/49455609/794962
 */
function getThisPackageDir(): string {
  const packagePath = path.dirname(require.resolve('../package.json'));
  return packagePath;
}

/**
 * Returns the full file path of the native clarity-cli executable.
 * Throws an error if it does not exist.
 * @param checkExists [Default = true] If true then an error is thrown if the file does not exist.
 * @param versionTag Defaults to the current `CORE_SDK_TAG`.
 */
export function getDefaultBinaryFilePath({
  checkExists = true,
  versionTag,
}: { checkExists?: boolean; versionTag?: string } = {}): string {
  if (!versionTag) {
    versionTag = CORE_SDK_TAG;
  }
  const thisPkgDir = path.resolve(getThisPackageDir());
  const binFileName = getExecutableFileName('clarity-cli');
  const binFilePath = path.join(thisPkgDir, '.native-bin', versionTag, binFileName);
  if (checkExists && !fs.existsSync(binFilePath)) {
    throw new Error(`Native binary does not appear to be installed at ${binFilePath}`);
  }
  return binFilePath;
}

export async function installDefaultPath(): Promise<boolean> {
  const installPath = getDefaultBinaryFilePath({ checkExists: false });
  const logger = ConsoleLogger;

  const versionTag: string | undefined = CORE_SDK_TAG;

  // Check if source git tag/branch was specified using env var
  const localPath = getOverriddenCoreSource();

  if (localPath) {
    logger.log(`Found path source env var ${localPath}`);
    return moveFromPath({
      logger,
      outputFilePath: installPath,
      inputFilePath: localPath,
    });
  }

  const outputIsValid = verifyOutputFile(logger, true, installPath);
  if (!outputIsValid) {
    return false;
  }

  const success = await fetchDistributable({
    logger: logger,
    overwriteExisting: true,
    outputFilePath: installPath,
    versionTag: versionTag,
  });

  return success;
}

export function install(opts: {
  fromSource: boolean;
  logger: Logger;
  overwriteExisting: boolean;
  outputFilePath: string;
  versionTag: string;
}): Promise<boolean> {
  const outputIsValid = verifyOutputFile(opts.logger, opts.overwriteExisting, opts.outputFilePath);
  if (!outputIsValid) {
    return Promise.resolve(false);
  }
  return fetchDistributable(opts);
}

export function makeProvider() {
  const binFile = getDefaultBinaryFilePath();
  const dbFileName = getTempFilePath();
  return new NativeClarityBinProvider(dbFileName, binFile);
}

export const createClarityBin = async () => {
  const provider = makeProvider();
  // TODO: allow testnet/mainnet flag
  const args = ['initialize', '-', provider.dbFilePath, '--testnet'];
  await provider.runCommand(args, {
    stdin: JSON.stringify([]),
  });
  return provider;
};

export function hasStdErr(stderr: string) {
  if (!stderr) return false;
  if (stderr.includes('Used unimplemented cost function')) return false;
  if (stderr.includes('INFO [')) return false;
  return true;
}
