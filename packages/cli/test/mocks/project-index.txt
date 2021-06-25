import { echoInfo } from './echo';
import { nestedInfo } from './nested/nested';
export { EchoContract } from './echo';
export { NestedContract } from './nested/nested';

export const contracts = {
  echo: echoInfo,
  nested: nestedInfo,
};
