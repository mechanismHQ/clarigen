interface EmulatedTransaction {
  'emulated-contract-publish': {
    'contract-name': string;
    'emulated-sender': string;
    path: string;
  };
}

interface RequirementTransaction {
  'requirement-publish': {
    'contract-id': string;
    'remap-sender': string;
    'remap-principals': Record<string, string>;
    path: string;
  };
}

interface ContractPublishTransaction {
  'contract-publish': {
    'contract-name': string;
    'expected-sender': string;
    path: string;
  };
}

// <clarinet>/components/deployments/src/types.rs
// <TransactionSpecification>
export type Transaction = EmulatedTransaction | RequirementTransaction | ContractPublishTransaction;

// type Batch = Transaction[];
export interface Batch<T extends Transaction> {
  id: number;
  transactions: Readonly<T[]>;
}

interface SimnetAccount {
  address: string;
  name: string;
  balance: string;
}

export interface SimnetAccountDeployer extends SimnetAccount {
  name: 'deployer';
}

export interface SimnetDeploymentPlan {
  network: 'simnet';
  genesis: {
    wallets: Readonly<[SimnetAccountDeployer, ...SimnetAccount[]]>;
    contracts: Readonly<string[]>;
  };
  plan: {
    batches: Readonly<Batch<EmulatedTransaction>[]>;
  };
}

export interface DevnetDeploymentPlan {
  network: 'devnet';
  plan: {
    batches: Readonly<Batch<RequirementTransaction | ContractPublishTransaction>[]>;
  };
}

export type DeploymentPlan = SimnetDeploymentPlan | DevnetDeploymentPlan;

export function flatBatch<T extends Transaction>(batches: Batch<T>[]) {
  // const start: T[][] = [];
  const txs: T[] = [];
  batches.forEach(batch => txs.push(...batch.transactions));
  return txs;
}

export function getDeploymentContract(
  contractName: string,
  deployment: DeploymentPlan
): Transaction {
  const txs: Transaction[] = flatBatch(deployment.plan.batches as Batch<Transaction>[]);
  for (const tx of txs) {
    if ('requirement-publish' in tx) {
      const [_, name] = tx['requirement-publish']['contract-id'].split('.');
      if (name === contractName) {
        return tx;
      }
    } else if ('emulated-contract-publish' in tx) {
      if (tx['emulated-contract-publish']['contract-name'] === contractName) {
        return tx;
      }
    } else if ('contract-publish' in tx) {
      const contract = tx['contract-publish'];
      if (contract['contract-name'] === contractName) {
        return tx;
      }
    }
  }
  throw new Error(`Unable to find deployment tx for contract '${contractName}'`);
}

export function getDeploymentTxPath(tx: Transaction): string {
  if ('requirement-publish' in tx) {
    return tx['requirement-publish'].path;
  } else if ('emulated-contract-publish' in tx) {
    const contract = tx['emulated-contract-publish'];
    return contract.path;
  } else if ('contract-publish' in tx) {
    const contract = tx['contract-publish'];
    return contract.path;
  }
  throw new Error('Couldnt get path for deployment tx.');
}

export function getIdentifier(tx: Transaction): string {
  if ('requirement-publish' in tx) {
    const [_, name] = tx['requirement-publish']['contract-id'].split('.');
    return tx['requirement-publish']['contract-id'];
  } else if ('emulated-contract-publish' in tx) {
    const contract = tx['emulated-contract-publish'];
    return `${contract['emulated-sender']}.${contract['contract-name']}`;
  } else if ('contract-publish' in tx) {
    const contract = tx['contract-publish'];
    return `${contract['expected-sender']}.${contract['contract-name']}`;
  }
  console.log(tx);
  throw new Error(`Unable to find ID for contract.`);
}
