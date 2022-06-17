import { makeConfig } from '../../tsup.config';

export default makeConfig({
  splitting: false,
  format: ['cjs'],
  dts: false,
  entry: ['src/index.ts', 'src/commands/index.ts'],
  onSuccess: 'node copy-types.js',
  shims: false,
  minify: false,
  skipNodeModulesBundle: true,
});
