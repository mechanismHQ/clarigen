import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import { Logger } from './logger';

export function makeUniqueTempDir() {
  const osTempDir = os.tmpdir();
  const uniqueTempDir = fs.mkdtempSync(`${osTempDir}${path.sep}`);
  return uniqueTempDir;
}

/**
 * If the current platform is Windows then returns [[file]] with
 * the `.exe` extension appended.
 * Otherwise, returns the given [[file]] unchanged.
 * @param file A file name or path to file.
 */
export function getExecutableFileName(file: string) {
  if (os.platform() === 'win32' || os.platform() === 'cygwin') {
    const windowsExecutableExt = '.exe';
    if (path.extname(file) !== windowsExecutableExt) {
      return `${file}${windowsExecutableExt}`;
    }
  }
  return file;
}

/**
 * Ensures the provided output directory exists and is writable.
 * Deletes the provided output file if it already exists and overwrite has been specified.
 */
export function verifyOutputFile(
  logger: Logger,
  overwriteExisting: boolean,
  outputFilePath: string
): boolean {
  const fullFilePath = path.resolve(outputFilePath);
  const outputDirectory = path.dirname(fullFilePath);

  try {
    if (fs.existsSync(fullFilePath)) {
      const stat = fs.lstatSync(fullFilePath);
      if (!stat.isFile()) {
        logger.error(`The specified output file path exists and is not a file: ${fullFilePath}`);
        return false;
      }
      if (!overwriteExisting) {
        logger.error(`The specified output file path already exists: ${fullFilePath}`);
        logger.error('Specify the overwrite option to ignore this error.');
        return false;
      }
      logger.log(`Overwriting existing file: ${fullFilePath}`);
      fs.unlinkSync(fullFilePath);
    } else {
      fs.mkdirpSync(outputDirectory);
    }
    return true;
  } catch (error) {
    logger.error(error as Error);
    const fsErr = error as NodeJS.ErrnoException;
    if (fsErr.code === 'EACCES' || fsErr.code === 'EPERM') {
      logger.error(`Permission error writing to ${fullFilePath}`);
      logger.error('Try running with sudo or elevated permissions');
    } else {
      logger.error(`Error writing to ${fullFilePath}`);
    }
    return false;
  }
}

export const moveFromPath = (opts: {
  logger: Logger;
  outputFilePath: string;
  inputFilePAth: string;
}) => {
  opts.logger.log(`Copying ${opts.inputFilePAth} to ${opts.outputFilePath}`);
  const dirName = path.dirname(opts.outputFilePath);
  fs.mkdirpSync(dirName);
  fs.copyFileSync(opts.inputFilePAth, opts.outputFilePath);
  return true;
};

export function getTempFilePath(fileNameTemplate = 'temp-{uniqueID}-file') {
  const uniqueID = `${(Date.now() / 1000) | 0}-${Math.random().toString(36).substr(2, 6)}`;
  const fileName = fileNameTemplate.replace('{uniqueID}', uniqueID);
  return path.join(os.tmpdir(), fileName);
}
