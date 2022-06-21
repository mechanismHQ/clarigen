import { contractFactory } from '@clarigen/core/src';
import { StacksMocknet } from 'micro-stacks/network';
import { contracts } from '../../unit-test/test/clarinet-project/clarigen/single';
import { NodeProvider } from '../src';

test.skip('types are ok', async () => {
  const provider = NodeProvider({
    privateKey: 'asdf',
    network: new StacksMocknet(),
  });
  const { tester } = contractFactory(contracts, 'asdf');
  const call = tester.echo('asdf');
  // ensure TS type of `val` is string
  const val = await provider.ro(tester.echo('asdf'));
});
