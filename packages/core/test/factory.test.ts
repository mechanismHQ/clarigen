import { contracts } from '../../unit-test/test/clarinet-project/clarigen/single';
import { contractFactory } from '../src';

test('can make the factory', () => {
  const { tester } = contractFactory(contracts, 'addr');
  const tx = tester.echo('asdf');
  expect(tx.nativeArgs).toEqual(['asdf']);
  expect(tester.maps.simpleMap.name).toEqual('simple-map');
  expect(tester.identifier).toEqual('addr.tester');
});
