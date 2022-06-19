import NodeEnvironment from 'jest-environment-node';
import type {JestEnvironmentConfig, EnvironmentContext} from '@jest/environment';
import { contracts, accounts } from './clarinet-project/clarigen/single';
import type { Config, Global } from '@jest/types';
import { contractFactory, ContractFactory } from '@clarigen/core';
import { TestProvider } from '../src';

type Contracts = ContractFactory<typeof contracts>;

declare global {
  namespace NodeJS {
    interface Global {
      t: TestProvider;
    }
  }
}

class ClarigenEnvironment extends NodeEnvironment {
  public contracts: Contracts;

  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
    const factory = contractFactory(contracts, accounts.deployer.address);
    this.contracts = factory;
  }

  async setup() {
    const deployer = accounts.deployer.address;
    const factory = contractFactory(contracts, deployer) as Contracts;
    const provider = await TestProvider.fromFactory(factory);
    this.global.t = provider;
  }
}

export default ClarigenEnvironment;
module.exports = ClarigenEnvironment;