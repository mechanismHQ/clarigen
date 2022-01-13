import { readFile as readFileFn } from 'fs/promises';
import { resolve } from 'path';

export function readFile(path: string) {
  const abiPath = resolve(__dirname, path);
  return readFileFn(abiPath, { encoding: 'utf-8' });
}
