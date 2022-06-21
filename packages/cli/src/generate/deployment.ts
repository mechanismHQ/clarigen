import { load } from 'js-yaml';
import { mkdir, readFile } from 'fs/promises';
import { resolve } from 'path';
import { existsSync } from 'fs';
import type { ConfigFile } from '../config';
import { writeFile } from '../writer';

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
  'contract-name': string;
  'expected-sender': string;
  path: string;
}

// <clarinet>/components/deployments/src/types.rs
// <TransactionSpecification>
type Transaction = EmulatedTransaction;

// type Batch = Transaction[];
interface Batch<T> {
  id: number;
  transactions: T[];
}

interface SimnetAccount {
  address: string;
  name: string;
  balance: string;
}

interface SimnetAccountDeployer extends SimnetAccount {
  name: 'deployer';
}

interface SimnetDeploymentPlan {
  network: 'simnet';
  genesis: {
    wallets: [SimnetAccountDeployer, ...SimnetAccount[]];
    contracts: string[];
  };
  plan: {
    batches: Batch<EmulatedTransaction>[];
  };
}

interface DevnetDeploymentPlan {
  network: 'devnet';
  plan: {
    batches: Batch<RequirementTransaction | ContractPublishTransaction>[];
  };
}

type DeploymentPlan = SimnetDeploymentPlan | DevnetDeploymentPlan;

export async function parseDeployment(path: string): Promise<DeploymentPlan> {
  const contents = await readFile(path, { encoding: 'utf-8' });
  const parsed = load(contents);
  return parsed as DeploymentPlan;
}

export async function generateDeployment(network: string, outputDir: string) {
  const file = `default.${network}-plan.yaml`;
  const deploymentPath = resolve(process.cwd(), 'deployments', file);
  if (existsSync(deploymentPath)) {
    const plan = await parseDeployment(deploymentPath);
    const varName = `${network}Deployment`;
    const contents = `export const ${varName} = ${JSON.stringify(
      plan
    )} as const;
    `;
    const outputFile = resolve(outputDir, `${network}.ts`);
    await writeFile(outputFile, contents);
  }
}

export async function generateDeployments(config: ConfigFile) {
  // const deploymentsFolder = resolve(process.cwd(), 'deployments');
  const networks = ['devnet', 'simnet', 'testnet', 'mainnet'];
  const folder = resolve(process.cwd(), config.outputDir, 'deployments');
  const generates = networks.map((n) => generateDeployment(n, folder));
  await mkdir(folder, { recursive: true });
  await Promise.all(generates);
}
