import { Options, defineConfig } from 'tsup';

export const defaultConfig: Options = {
  target: 'node16',
  entry: ['src/index.ts'],
  minify: true,
  outDir: 'dist',
  dts: true,
  splitting: true,
  format: ['esm', 'cjs'],
};

export function makeConfig(opts: Partial<Options> = {}) {
  const config: Options = {
    ...defaultConfig,
    ...opts,
  };
  // console.log('config', config);
  return defineConfig(config);
}
