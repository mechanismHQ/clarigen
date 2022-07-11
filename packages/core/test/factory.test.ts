import { contracts } from '../../unit-test/test/clarinet-project/clarigen/single';
import { simnetDeployment } from '../../unit-test/test/clarinet-project/clarigen/deployments/simnet';
import { devnetDeployment } from '../../unit-test/test/clarinet-project/clarigen/deployments/devnet';

import { contractsFactory, deploymentFactory } from '../src';

test('can make the factory', () => {
  const { tester } = contractsFactory(contracts, 'addr');
  const tx = tester.echo('asdf');
  expect(tx.nativeArgs).toEqual(['asdf']);
  expect(tester.maps.simpleMap.name).toEqual('simple-map');
  expect(tester.identifier).toEqual('addr.tester');
});

test('can work with deployment', () => {
  const dep = simnetDeployment;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  (dep.plan.batches[0].transactions[3]['emulated-contract-publish'] as any).path = 'myPath';
  const { tester } = deploymentFactory(contracts, simnetDeployment);
  expect(tester.contractFile).toEqual('myPath');
  expect(tester.identifier).toEqual('ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.tester');

  const devnet = deploymentFactory(contracts, devnetDeployment);
});

test('uses contract name from abi def', () => {
  const demo = {
    'Weird-Name': contracts.tester,
  };
  const factory = contractsFactory(demo, 'addr');
  expect(factory['Weird-Name'].identifier).toEqual('addr.tester');
});
