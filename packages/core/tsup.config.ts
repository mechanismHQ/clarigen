import { makeConfig } from '../../tsup.config';

export default makeConfig({
  onSuccess: 'node make-deno.js',
});
