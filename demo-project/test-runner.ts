import { Clarinet } from 'https://deno.land/x/clarinet@v1.4.2/index.ts';

Clarinet.run({
  fn(_accounts, contracts) {
    for (const key of contracts.keys()) {
      console.log(key);
    }
  },
});
