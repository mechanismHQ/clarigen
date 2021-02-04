import { makeTypes } from '../src/declaration';
import { appmap } from './contracts/appmap';

test('can gen', () => {
  makeTypes(appmap, 'app-map');
});
