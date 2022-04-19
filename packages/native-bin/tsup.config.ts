import { makeConfig } from '../../tsup.config';

export default makeConfig({
  splitting: false,
  // format: ['cjs', 'esm'],
  // outDir: 'dist',
  entry: ['src/index.ts', 'src/direct-install.ts'],
});
