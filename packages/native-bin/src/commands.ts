import { ClarityAbi, ResultAssets } from '@clarigen/core';
import { getTempFilePath } from './fs-util';
import { getDefaultBinaryFilePath } from './helpers';
import { NativeClarityBinProvider } from './provider';

function coverageArgs(folder?: string) {
  return folder ? ['--c', folder] : [];
}

export interface Allocation {
  principal: string;
  amount: bigint;
}

export interface Costs {
  read_count: number;
  read_length: number;
  runtime: number;
  write_count: number;
  write_length: number;
}

interface ExecuteOk {
  success: true;
  message: string;
  events: any[];
  output_serialized: string;
  costs: Costs;
  assets: ResultAssets;
  stderr: string;
  // todo: logs
}

interface ExecuteErr {
  message: string;
  error: any;
  output_serialized: string;
  costs: Costs;
  success: false;
  stderr: string;
}

type ExecuteResult = ExecuteOk | ExecuteErr;

export const executeJson = async ({
  contractAddress,
  senderAddress,
  functionName,
  provider,
  args = [],
  coverageFolder,
}: {
  contractAddress: string;
  senderAddress: string;
  provider: NativeClarityBinProvider;
  functionName: string;
  args?: string[];
  coverageFolder?: string;
}): Promise<ExecuteResult> => {
  const result = await provider.runCommand([
    'execute',
    '--costs',
    '--assets',
    ...coverageArgs(coverageFolder),
    provider.dbFilePath,
    contractAddress,
    functionName,
    senderAddress,
    ...args,
  ]);
  if (process.env.PRINT_CLARIGEN_STDERR && result.stderr) {
    console.log(result.stderr);
  }
  try {
    const response: ExecuteResult = JSON.parse(result.stdout);
    if (response && 'error' in response) {
      throw new Error(`Transaction error: ${JSON.stringify(response.error, null, 2)}`);
    }
    if (result.exitCode !== 0) {
      throw new Error(`Execution error: ${result.stderr}`);
    }
    return {
      ...response,
      stderr: result.stderr,
    };
  } catch (error) {
    // console.error('[clarigen]: error parsing execute result:', result.stdout);
    throw new Error(
      `Error parsing clarity execution.\nstdout: ${result.stdout}\nstderr:${result.stderr}`
    );
  }
};

interface EvalOk {
  success: true;
  costs: Costs;
  output_serialized: string;
}

interface EvalErr {
  success: false;
  error: string;
}

type EvalResult = EvalOk | EvalErr;

export interface Eval extends EvalOk {
  stderr: string;
}

export const evalRaw = async ({
  contractAddress,
  code,
  provider,
  coverageFolder,
}: {
  contractAddress: string;
  provider: NativeClarityBinProvider;
  code: string;
  coverageFolder?: string;
}): Promise<Eval> => {
  const receipt = await provider.runCommand(
    [
      'eval_at_chaintip',
      '--costs',
      ...coverageArgs(coverageFolder),
      contractAddress,
      provider.dbFilePath,
    ],
    {
      stdin: code,
    }
  );
  if (process.env.PRINT_CLARIGEN_STDERR && receipt.stderr) {
    console.log(receipt.stderr);
  }
  try {
    const response: EvalResult = JSON.parse(receipt.stdout);
    if (response.success === false) {
      throw new Error(JSON.stringify(response.error, null, 2));
    }
    return {
      ...response,
      stderr: receipt.stderr,
    };
  } catch (error) {
    console.error('[@clarigen/test] Invalid JSON result from `clarity-cli`:', receipt.stdout);
    console.error('[@clarigen/test] stderr:', receipt.stderr);
    throw error;
  }
};

export const evalJson = ({
  contractAddress,
  functionName,
  provider,
  args = [],
  coverageFolder,
}: {
  contractAddress: string;
  functionName: string;
  provider: NativeClarityBinProvider;
  args?: string[];
  coverageFolder?: string;
}): Promise<Eval> => {
  const code = `(${functionName} ${args.join(' ')})`;
  return evalRaw({
    contractAddress,
    provider,
    code,
    coverageFolder,
  });
};

export interface ClarinetAccount {
  balance: bigint;
  address: string;
}

export interface ClarinetAccounts {
  deployer: ClarinetAccount;
  [key: string]: ClarinetAccount;
}

type AllocationOrAccounts = ClarinetAccounts | Allocation[];

export function getAllocations(allocations?: AllocationOrAccounts): Allocation[] {
  if (!allocations) return [];
  if ('deployer' in allocations) {
    return Object.values(allocations).map(a => ({
      amount: a.balance,
      principal: a.address,
    }));
  } else if (Array.isArray(allocations)) {
    return allocations;
  }
  return [];
}

function bigintReplacer(key: string, value: any) {
  if (typeof value === 'bigint') return `${value}n`;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return value;
}

function stringifyAllocations(allocations: Allocation[]) {
  const json = JSON.stringify(allocations, bigintReplacer);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return json.replace(/"(-?\d+)n"/g, (_, a) => a);
}

export const createClarityBin = async ({
  allocations,
  testnet = true,
}: { allocations?: AllocationOrAccounts; testnet?: boolean } = {}) => {
  const binFile = getDefaultBinaryFilePath();
  const dbFileName = getTempFilePath();
  const _allocations = getAllocations(allocations);
  const provider = new NativeClarityBinProvider(dbFileName, binFile);
  const args = ['initialize', '-', dbFileName];
  if (testnet) args.push('--testnet');
  const receipt = await provider.runCommand(args, {
    stdin: stringifyAllocations(_allocations),
  });
  return provider;
};

export async function getDefaultClarityBin(
  clarityBinOrAccounts?: NativeClarityBinProvider | ClarinetAccounts
) {
  let clarityBin: NativeClarityBinProvider;
  if (!clarityBinOrAccounts) {
    clarityBin = await createClarityBin();
  } else if ('deployer' in clarityBinOrAccounts) {
    clarityBin = await createClarityBin({ allocations: clarityBinOrAccounts });
    // } else if ('closeActions' in clarityBinOrAccounts) {
  } else if (clarityBinOrAccounts instanceof NativeClarityBinProvider) {
    clarityBin = clarityBinOrAccounts;
  } else {
    throw new Error('Should never get here');
  }
  return clarityBin;
}

interface DeployOutputErr {
  error: {
    initialization: string;
  };
}

interface DeployOutputOk {
  analysis: ClarityAbi;
}

export async function deployContract({
  contractIdentifier,
  contractFilePath,
  provider,
  coverageFolder,
}: {
  contractIdentifier: string;
  contractFilePath: string;
  provider: NativeClarityBinProvider;
  coverageFolder?: string;
}): Promise<ClarityAbi> {
  const receipt = await provider.runCommand([
    'launch',
    contractIdentifier,
    contractFilePath,
    provider.dbFilePath,
    '--costs',
    '--assets',
    '--output_analysis',
    ...coverageArgs(coverageFolder),
  ]);
  if (hasStdErr(receipt.stderr)) {
    throw new Error(`Error on ${contractFilePath}:
  ${receipt.stderr}
    `);
  }
  const output = JSON.parse(receipt.stdout) as DeployOutputErr | DeployOutputOk;
  if ('error' in output) {
    const { initialization } = output.error;
    if (initialization?.includes('\nNear:\n')) {
      const [error, trace] = initialization.split('\nNear:\n');
      let startLine = '';
      const matcher = /start_line: (\d+),/;
      const matches = matcher.exec(trace);
      if (matches) startLine = matches[1];
      throw new Error(`Error on ${contractFilePath}:
    ${error}
    ${startLine ? `Near line ${startLine}` : ''}
    Raw trace:
    ${trace}
      `);
    }
    throw new Error(`Error on ${contractFilePath}:
  ${JSON.stringify(output.error, null, 2)}
    `);
  }
  const abi = output.analysis;
  return abi;
}

export function hasStdErr(stderr: string) {
  if (!stderr) return false;
  if (stderr.includes('Used unimplemented cost function')) return false;
  if (stderr.includes('INFO [')) return false;
  return true;
}
