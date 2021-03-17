import { readFile as readFileFn } from 'fs';
import { promisify } from 'util';
import { resolve } from 'path';

const readFileAsync = promisify(readFileFn);

export function readFile(path: string) {
  const abiPath = resolve(__dirname, path);
  return readFileAsync(abiPath, { encoding: 'utf-8' });
}
