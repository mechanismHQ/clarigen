import { load } from 'js-yaml';
import { mkdir, readFile } from 'fs/promises';
import { resolve } from 'path';
import { existsSync } from 'fs';
import type { ConfigFile } from '../config';
import { writeFile } from '../writer';
import { DeploymentPlan } from '@clarigen/core';

export async function parseDeployment(path: string): Promise<DeploymentPlan> {
  const contents = await readFile(path, { encoding: 'utf-8' });
  const parsed = load(contents);
  return parsed as DeploymentPlan;
}

export async function generateDeployment(network: string, config: ConfigFile) {
  const file = `default.${network}-plan.yaml`;
  const deploymentPath = resolve(
    process.cwd(),
    config.clarinet,
    'deployments',
    file
  );
  if (existsSync(deploymentPath)) {
    const plan = await parseDeployment(deploymentPath);
    const varName = `${network}Deployment`;
    const contents = `export const ${varName} = ${JSON.stringify(
      plan
    )} as const;
    `;
    const outputFile = resolve(
      config.outputDir,
      'deployments',
      `${network}.ts`
    );
    await writeFile(outputFile, contents);
  }
}

export async function generateDeployments(config: ConfigFile) {
  const networks = ['devnet', 'simnet', 'testnet', 'mainnet'];
  const folder = resolve(process.cwd(), config.outputDir, 'deployments');
  await mkdir(folder, { recursive: true });
  const generates = networks.map((n) => generateDeployment(n, config));
  await Promise.all(generates);
}
