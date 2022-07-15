interface EmulatedContractPublishTransaction {
  'emulated-contract-publish': {
    'contract-name': string;
    'emulated-sender': string;
    path: string;
  };
}

interface RequirementPublishTransaction {
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

interface ContractCallTransaction {
  'contract-call': {
    'contract-id': string;
    'expected-sender': string;
    parameters: Readonly<string[]>;
    method: string;
  };
}

interface EmulatedContractCallTransaction {
  'emulated-contract-call': {
    'contract-id': string;
    'emulated-sender': string;
    parameters: Readonly<string[]>;
    method: string;
  };
}

interface BtcTransferTransaction {
  'btc-transfer': {
    'expected-sender': string;
    recipient: string;
    'sats-per-byte': string;
    'sats-amount': string;
  };
}

// <clarinet>/components/deployments/src/types.rs
// <TransactionSpecification>
export type Transaction =
  | EmulatedContractPublishTransaction
  | RequirementPublishTransaction
  | ContractPublishTransaction
  | EmulatedContractCallTransaction
  | BtcTransferTransaction
  | ContractCallTransaction;

export type ContractTransaction =
  | EmulatedContractPublishTransaction
  | RequirementPublishTransaction
  | ContractPublishTransaction;

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
    batches: Readonly<
      Batch<EmulatedContractPublishTransaction | EmulatedContractCallTransaction>[]
    >;
  };
}

export interface DevnetDeploymentPlan {
  network: 'devnet';
  plan: {
    batches: Readonly<
      Batch<
        | RequirementPublishTransaction
        | ContractPublishTransaction
        | ContractCallTransaction
        | BtcTransferTransaction
      >[]
    >;
  };
}

export type TestnetDeploymentPlan = Omit<DevnetDeploymentPlan, 'network'> & {
  network: 'testnet';
};

export interface MainnetDeploymentPlan {
  network: 'mainnet';
  plan: {
    batches: Readonly<
      Batch<ContractPublishTransaction | ContractCallTransaction | BtcTransferTransaction>[]
    >;
  };
}

export type DeploymentPlan =
  | SimnetDeploymentPlan
  | DevnetDeploymentPlan
  | TestnetDeploymentPlan
  | MainnetDeploymentPlan;

export function flatBatch<T extends Transaction>(batches: Batch<T>[]) {
  // const start: T[][] = [];
  const txs: T[] = [];
  batches.forEach(batch => txs.push(...batch.transactions));
  return txs;
}

export function getContractTxs(batches: Batch<Transaction>[]): ContractTransaction[] {
  const txs = flatBatch(batches);
  return txs.filter(isContractTx);
}

export function getDeploymentContract(
  contractName: string,
  deployment: DeploymentPlan
): ContractTransaction {
  const txs: Transaction[] = flatBatch(deployment.plan.batches as Batch<Transaction>[]);
  for (const tx of txs) {
    if (!isContractTx(tx)) continue;
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

export function getDeploymentTxPath(tx: ContractTransaction): string {
  if (!isContractTx(tx)) {
    throw new Error('Unable to get path for tx type.');
  }
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

export function getIdentifier(tx: ContractTransaction): string {
  if (!isContractTx(tx)) {
    throw new Error('Unable to get ID for tx type.');
  }
  if ('requirement-publish' in tx) {
    const spec = tx['requirement-publish'];
    const [_, name] = spec['contract-id'].split('.');
    return `${spec['remap-sender']}.${name}`;
  } else if ('emulated-contract-publish' in tx) {
    const contract = tx['emulated-contract-publish'];
    return `${contract['emulated-sender']}.${contract['contract-name']}`;
  } else if ('contract-publish' in tx) {
    const contract = tx['contract-publish'];
    return `${contract['expected-sender']}.${contract['contract-name']}`;
  }
  throw new Error(`Unable to find ID for contract.`);
}

export function isContractTx(tx: Transaction): tx is ContractTransaction {
  if ('contract-call' in tx) return false;
  if ('btc-transfer' in tx) return false;
  if ('emulated-contract-call' in tx) return false;
  return true;
}
