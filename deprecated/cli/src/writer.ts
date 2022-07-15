// Utilities for writing and formatting files
import { writeFile as _writeFile } from 'fs/promises';
import { basename } from 'path';
import { resolveConfig, format, Options } from 'prettier';

const defaultPrettierConfig: Options = {
  printWidth: 80,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
};

export async function resolvePrettierConfig(): Promise<Options> {
  try {
    const local = await resolveConfig(process.cwd());
    if (local) return local;
  } catch (error) {}
  return defaultPrettierConfig;
}

export async function formatFile(contents: string, path: string) {
  try {
    const fileName = basename(path);
    const config = await resolvePrettierConfig();
    const formatted = format(contents, {
      ...config,
      filepath: fileName,
    });
    return formatted;
  } catch (error) {
    // handle formatting error
  }
  return contents;
}

export async function writeFile(path: string, contents: string) {
  const formatted = await formatFile(contents, path);
  await _writeFile(path, formatted);
}
