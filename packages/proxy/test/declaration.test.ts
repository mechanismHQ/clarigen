import { makeTypes } from '@clarion/proxy';
import { appmap } from './contracts/appmap/abi';
import { pox } from './contracts/pox/abi';
import { SimpleInterface } from './contracts/simple/abi';

test('can gen', () => {
  makeTypes(appmap, 'app-map');
});

test('generate pox interface', () => {
  makeTypes(pox, 'pox');
});

// export type TestResponse = ClarityTypes.ResponseOkCV<

test('generate simple interface', () => {
  makeTypes(SimpleInterface, 'simple');
});
