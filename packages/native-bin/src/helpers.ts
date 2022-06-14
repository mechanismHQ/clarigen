import { existsSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fetchDistributable } from './fetch-dist';
import { getExecutableFileName, getTempFilePath, moveFromPath, verifyOutputFile } from './fs-util';
import { ConsoleLogger, Logger } from './logger';
import { NativeClarityBinProvider } from './provider';

/**
 * Should correspond to both a git tag on the blockstack-core repo and a
 * set of clarity-binary distributables uploaded to the cloud storage endpoint.
 */
export const CORE_SDK_TAG = '2.05.0.1.0';

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
  const packagePath = dirname(require.resolve('../package.json'));
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
  const thisPkgDir = resolve(getThisPackageDir());
  const binFileName = getExecutableFileName('clarity-cli');
  const binFilePath = join(thisPkgDir, '.native-bin', versionTag, binFileName);
  if (checkExists && !existsSync(binFilePath)) {
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
