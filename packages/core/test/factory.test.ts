import { contracts } from '../../unit-test/test/clarinet-project/clarigen/single';
import { simnetDeployment } from '../../unit-test/test/clarinet-project/clarigen/deployments/simnet';

import { contractFactory } from '../src';

test('can make the factory', () => {
  const { tester } = contractFactory(contracts, 'addr');
  const tx = tester.echo('asdf');
  expect(tx.nativeArgs).toEqual(['asdf']);
  expect(tester.maps.simpleMap.name).toEqual('simple-map');
  expect(tester.identifier).toEqual('addr.tester');
});

test('can work with deployment', () => {
  const { tester } = contractFactory(contracts, simnetDeployment);
  expect(tester.identifier).toEqual('ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.tester');
});
