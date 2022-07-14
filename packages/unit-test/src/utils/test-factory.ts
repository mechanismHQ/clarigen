import { DeploymentsForContracts, ProjectFactory } from '@clarigen/core';
import {
  AllContracts,
  deploymentFactory,
  SimnetDeploymentPlan,
  projectFactory,
  Project,
  ContractDeployments,
} from '@clarigen/core';
import { ClarinetAccount, ClarinetAccounts } from '@clarigen/native-bin';

type Account = Omit<ClarinetAccount, 'balance'> & { balance: number };

export interface Simnet {
  accounts: {
    deployer: Account;
    [key: string]: Account;
  };
  deployment: {
    identifier: string;
    file: string;
  }[];
}

export function testFactory<
  P extends Project<C, D>,
  C extends AllContracts,
  D extends DeploymentsForContracts<C>
>(project: P): ProjectFactory<P, 'simnet'> {
  return projectFactory(project, 'simnet');
}

// export function testFactory<T extends AllContracts, P extends SimnetDeploymentPlan>(
//   contractDef: T,
//   deployment: P
// ) {
//   const accounts = Object.fromEntries(
//     deployment.genesis.wallets.map(a => {
//       return [
//         a.name,
//         {
//           balance: BigInt(a.balance),
//           address: a.address,
//         },
//       ];
//     })
//   ) as Accounts<P>;

//   const contracts = deploymentFactory(contractDef, deployment);

//   return {
//     contracts,
//     accounts,
//   };
// }
