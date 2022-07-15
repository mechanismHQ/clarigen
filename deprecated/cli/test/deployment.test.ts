import { resolve } from 'path';
import { parseDeployment } from '../src/generate/deployment';

// interface Transaction {
//   "emulated-contract-publish": {
//     'contract-name': string;

//   }
// }

test('getting a deployment', async () => {
  const path = resolve(__dirname, '../deployments/default.simnet-plan.yaml');
  const parsed = await parseDeployment(path);
  console.log(parsed);
  console.log(parsed.plan.batches[0].transactions[0]);
  // console.log(parsed.genesis.wallets[0]);
});
