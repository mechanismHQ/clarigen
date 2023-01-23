import { makeConfig } from '../../tsup.config';

export default makeConfig({
  splitting: false,
  format: ['cjs', 'esm'],
  entry: ['src/index.ts', 'src/direct-install.ts'],
  minify: false,
});
