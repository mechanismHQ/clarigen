import * as fs from 'fs-extra';
import fetch from 'node-fetch';
import * as os from 'os';
import * as path from 'path';
import * as unzip from 'unzipper';
import { detectArch } from './detect-arch';
import { detectLibc } from './detect-libc';
import { getExecutableFileName, makeUniqueTempDir } from './fs-util';
import { Logger } from './logger';
import { pipelineAsync } from './stream-util';

const DIST_DOWNLOAD_URL_TEMPLATE =
  'https://github.com/blockstack/stacks-blockchain/releases/' +
  'download/{tag}/{platform}-{arch}.zip';

export const MACOS_ARM_URL =
  'https://gateway.pinata.cloud/ipfs/QmT66UdArWY3hYTcvimRer5orHEfMNgbWLBe8Rj5LJtKs9';

const enum SupportedDistPlatform {
  WINDOWS = 'windows',
  MACOS = 'macos',
  LINUX = 'linux',
  LINUX_MUSL = 'linux-musl',
}

const enum SupportedDistArch {
  x64 = 'x64',
}

/**
 * Checks if the currently executing platform and architecture has an distributable available
 * for download.
 * @param logger Optionally log error message for unsupported platform or arch.
 */
export function isDistAvailable(
  logger?: Logger
): { platform: SupportedDistPlatform; arch: SupportedDistArch } | false {
  let arch: SupportedDistArch;
  const detectedArch = detectArch(logger);
  switch (detectedArch) {
    case 'x64':
      arch = SupportedDistArch.x64;
      break;
    default:
      if (logger && !isMacArm()) {
        logger.error(`System arch "${detectedArch}" not supported. Must build from source.`);
      }
      return false;
  }

  let platform: SupportedDistPlatform;
  switch (os.platform()) {
    case 'win32':
    case 'cygwin':
      platform = SupportedDistPlatform.WINDOWS;
      break;
    case 'darwin':
      platform = SupportedDistPlatform.MACOS;
      break;
    case 'linux':
      if (detectLibc().isNonGlibcLinux) {
        platform = SupportedDistPlatform.LINUX_MUSL;
      } else {
        platform = SupportedDistPlatform.LINUX;
      }
      break;
    default:
      if (logger) {
        logger.error(`System platform "${os.platform()}" not supported. Must build from source.`);
      }
      return false;
  }
  return {
    platform,
    arch,
  };
}

/**
 * Gets a download url for a dist archive containing a binary that
 * can run in the currently executing system OS and architecture.
 * Returns false if system is incompatible with known available distributables.
 */
export function getDownloadUrl(logger: Logger, versionTag: string): string | false {
  const distInfo = isDistAvailable(logger);
  if (!distInfo) {
    return false;
  }
  const downloadUrl = DIST_DOWNLOAD_URL_TEMPLATE.replace('{tag}', versionTag)
    .replace('{platform}', distInfo.platform)
    .replace('{arch}', distInfo.arch);
  return downloadUrl;
}

/**
 * Returns true if install was successful.
 * @param opts
 */
export async function fetchDistributable(opts: {
  logger: Logger;
  overwriteExisting: boolean;
  outputFilePath: string;
  versionTag: string;
}): Promise<boolean> {
  const downloadUrl = getDownloadUrl(opts.logger, opts.versionTag);

  const didMacDownload = await downloadMacArm(opts.outputFilePath, opts.logger);
  if (didMacDownload) return true;

  if (!downloadUrl) return false;

  opts.logger.log(`Fetching ${downloadUrl}`);
  const httpResponse = await fetch(downloadUrl, { redirect: 'follow' });
  if (!httpResponse.ok) {
    opts.logger.error(`Bad http response ${httpResponse.status} ${httpResponse.statusText}`);
    return false;
  }

  const tempExtractDir = makeUniqueTempDir();
  opts.logger.log(`Extracting to temp dir ${tempExtractDir}`);

  const unzipStream = unzip.Extract({ path: tempExtractDir });
  await pipelineAsync(httpResponse.body, unzipStream);

  const binFileName = getExecutableFileName('clarity-cli');
  const tempBinFilePath = path.join(tempExtractDir, binFileName);

  opts.logger.log(`Moving ${tempBinFilePath} to ${opts.outputFilePath}`);
  fs.moveSync(tempBinFilePath, opts.outputFilePath);
  fs.removeSync(tempExtractDir);
  fs.chmodSync(opts.outputFilePath, 0o775);

  return true;
}

export function isMacArm() {
  return os.platform() === 'darwin' && os.arch() === 'arm64';
}

export async function downloadMacArm(outputFilePath: string, logger: Logger) {
  if (isMacArm()) {
    logger.log('Fetching Apple Silicon version of clarity-cli');
    const downloadUrl = MACOS_ARM_URL;
    const httpResponse = await fetch(downloadUrl, { redirect: 'follow' });
    if (!httpResponse.ok) {
      logger.error(`Bad http response ${httpResponse.status} ${httpResponse.statusText}`);
      return false;
    }
    await pipelineAsync(httpResponse.body, fs.createWriteStream(outputFilePath));
    fs.chmodSync(outputFilePath, 0o775);
    return true;
  } else {
    return false;
  }
}
