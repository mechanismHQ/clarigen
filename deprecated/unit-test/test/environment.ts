import NodeEnvironment from 'jest-environment-node';
import type { JestEnvironmentConfig, EnvironmentContext } from '@jest/environment';
import { TestProvider } from '../src';
import { simnet } from '../../../demo-project/esm';

class ClarigenEnvironment extends NodeEnvironment {
  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
  }

  async setup() {
    const provider = await TestProvider.fromProject(simnet, {
      clarinetPath: '../../',
    });
    this.global.t = provider;
  }
}

export default ClarigenEnvironment;
module.exports = ClarigenEnvironment;
