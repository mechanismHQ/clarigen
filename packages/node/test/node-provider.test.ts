import { projectFactory } from '@clarigen/core';
import { StacksMocknet } from 'micro-stacks/network';
import { NodeProvider } from '../src';
import { project } from '../../../demo-project/esm';

test.skip('types are ok', async () => {
  const provider = NodeProvider({
    privateKey: 'asdf',
    network: new StacksMocknet(),
  });
  const { tester } = projectFactory(project, 'simnet');
  const call = tester.echo('asdf');
  // ensure TS type of `val` is string
  const val = await provider.ro(tester.echo('asdf'));
  expect(val.startsWith('')).toEqual(true);
});
