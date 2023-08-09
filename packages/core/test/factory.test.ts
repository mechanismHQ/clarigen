import { project, contracts } from 'demo-project';
import { DeploymentNetwork, contractsFactory, mapFactory, projectFactory } from '../src';
import { stringAsciiCV, uintCV } from 'micro-stacks/clarity';

test('can make the factory', () => {
  const { tester } = contractsFactory(contracts, 'addr');
  const tx = tester.echo('asdf');
  expect(tx.nativeArgs).toEqual(['asdf']);
  expect(tester.maps.simpleMap.name).toEqual('simple-map');
  expect(tester.identifier).toEqual('addr.tester');
});

test('works with option-style args', () => {
  const { tester } = projectFactory(project, 'devnet');
  const tx = tester.echo({ val: 'hello' });
  expect(tx.functionArgs).toEqual([stringAsciiCV('hello')]);
});

test('works with spread args', () => {
  const { tester } = projectFactory(project, 'devnet');
  const tx = tester.echo('hello');
  expect(tx.functionArgs).toEqual([stringAsciiCV('hello')]);
});

test('uses contract name from abi def', () => {
  const demo = {
    'Weird-Name': contracts.tester,
  };
  const factory = contractsFactory(demo, 'addr');
  expect(factory['Weird-Name'].identifier).toEqual('addr.tester');
});

test('project factory', () => {
  const devnet = projectFactory(project, 'devnet');
  const { wrappedBitcoin } = devnet;
  expect(wrappedBitcoin.identifier).toEqual(
    'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.Wrapped-Bitcoin'
  );
  expect(projectFactory(project, 'mainnet').wrappedBitcoin.identifier).toEqual(
    'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin'
  );
});

test('map factory', () => {
  const { tester } = projectFactory(project, 'devnet');
  const map = tester.maps.simpleMap;
  const f = mapFactory(map, 1);
  expect(f.key).toEqual(1);
  expect(f.keyCV).toEqual(uintCV(1));
  expect(f.map.name).toEqual('simple-map');
});

test('projectFactory returns contract even if some deployment address missing', () => {
  const { tester } = projectFactory(project, 'mainnet');
  expect(tester).not.toBeTruthy();
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  // /* eslint-disable @typescript-eslint/no-unsafe-call */

  expect(() => {
    // @ts-ignore
    tester.echo('asdf');
  }).toThrow();

  /* eslint-enable @typescript-eslint/ban-ts-comment */
  /* eslint-enable @typescript-eslint/no-unsafe-call */

  const { tester: tester2 } = projectFactory(project, 'devnet' as unknown as DeploymentNetwork);
  expect(tester2).toBeTruthy();
});
