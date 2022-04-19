import { makeConfig } from '../../tsup.config';

export default makeConfig({
  splitting: false,
  format: ['cjs'],
  dts: false,
  entry: ['src/index.ts', 'src/commands.index.ts'],
});
