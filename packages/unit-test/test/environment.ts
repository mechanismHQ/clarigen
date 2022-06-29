import NodeEnvironment from 'jest-environment-node';
import type { JestEnvironmentConfig, EnvironmentContext } from '@jest/environment';
import { contracts } from './clarinet-project/clarigen/single';
import { contractFactory, ContractFactory, deploymentFactory } from '@clarigen/core';
import { TestProvider } from '../src';
import { simnetDeployment } from './clarinet-project/clarigen/deployments/simnet';

type Contracts = ContractFactory<typeof contracts>;

class ClarigenEnvironment extends NodeEnvironment {
  public contracts: Contracts;

  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
    const factory = deploymentFactory(contracts, simnetDeployment);
    this.contracts = factory;
  }

  async setup() {
    const factory = deploymentFactory(contracts, simnetDeployment) as Contracts;
    const provider = await TestProvider.fromFactory(factory, {
      clarinetPath: 'test/clarinet-project',
    });
    this.global.t = provider;
  }
}

export default ClarigenEnvironment;
module.exports = ClarigenEnvironment;
