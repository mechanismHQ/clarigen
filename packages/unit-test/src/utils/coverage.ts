import { NativeClarityBinProvider } from '@clarigen/native-bin';
import { mkdir, readdir, unlink } from 'fs/promises';
import { dirname, join, resolve } from 'path';

export async function setupCoverage(dir: string) {
  const dirName = resolve(process.cwd(), 'coverage');
  try {
    await mkdir(dirName);
  } catch (error) {}
  const files = await readdir(dirName);
  const removals = files.map(file => {
    return unlink(join(dirName, file));
  });
  await Promise.all(removals);
  return dirName;
}

export async function finishCoverage(provider: NativeClarityBinProvider, dir: string) {
  const lcovFile = join(dir, 'clarigen.lcov');
  await provider.runCommand(['make_lcov', dir, lcovFile]);
}
