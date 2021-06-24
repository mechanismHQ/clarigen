import { NativeClarityBinProvider, Client } from '@blockstack/clarity';
import { getDefaultBinaryFilePath } from '@blockstack/clarity-native-bin';
import { getTempFilePath } from '@blockstack/clarity/lib/utils/fsUtil';
import { ResultAssets } from '@clarigen/core';

export interface Allocation {
  principal: string;
  amount: number;
}

interface ExecuteOk {
  success: true;
  message: string;
  events: any[];
  output_serialized: string;
  costs: {
    [key: string]: any;
    runtime: number;
  };
  assets: ResultAssets;
  // todo: logs
}

interface ExecuteErr {
  message: string;
  error: any;
  output_serialized: string;
  costs: {
    [key: string]: any;
    runtime: number;
  };
  assets: ResultAssets;
  success: false;
}

type ExecuteResult = ExecuteOk | ExecuteErr;

export const executeJson = async ({
  contractAddress,
  senderAddress,
  functionName,
  provider,
  args = [],
}: {
  contractAddress: string;
  senderAddress: string;
  provider: NativeClarityBinProvider;
  functionName: string;
  args?: string[];
}) => {
  const result = await provider.runCommand([
    'execute',
    '--costs',
    '--assets',
    provider.dbFilePath,
    contractAddress,
    functionName,
    senderAddress,
    ...args,
  ]);
  const response: ExecuteResult = JSON.parse(result.stdout);
  if (response && 'error' in response) {
    throw new Error(`Transaction error: ${JSON.stringify(response.error, null, 2)}`);
  }
  if (result.exitCode !== 0) {
    throw new Error(`Execution error: ${result.stderr}`);
  }
  return response;
};

interface EvalOk {
  success: true;
  costs: {
    [key: string]: any;
    runtime: number;
  };
  output_serialized: string;
}

interface EvalErr {
  success: false;
  error: string;
}

type EvalResult = EvalOk | EvalErr;

export const evalJson = async ({
  contractAddress,
  functionName,
  provider,
  args = [],
}: {
  contractAddress: string;
  functionName: string;
  provider: NativeClarityBinProvider;
  args?: string[];
}) => {
  const evalCode = `(${functionName} ${args.join(' ')})`;
  const receipt = await provider.runCommand(
    ['eval_at_chaintip', '--costs', contractAddress, provider.dbFilePath],
    {
      stdin: evalCode,
    }
  );
  const response: EvalResult = JSON.parse(receipt.stdout);
  if (process.env.PRINT_CLARIGEN_STDERR && receipt.stderr) {
    console.log(receipt.stderr);
  }
  if (!response.success) {
    throw new Error(JSON.stringify(response.error, null, 2));
  }
  return response;
};

export const createClarityBin = async ({
  allocations = [],
}: { allocations?: Allocation[] } = {}) => {
  const binFile = getDefaultBinaryFilePath();
  const dbFileName = getTempFilePath();
  const provider = await NativeClarityBinProvider.create(allocations, dbFileName, binFile);
  return provider;
};

export async function deployContract(client: Client, provider: NativeClarityBinProvider) {
  const receipt = await provider.runCommand([
    'launch',
    client.name,
    client.filePath,
    provider.dbFilePath,
    '--costs',
    '--assets',
  ]);
  if (receipt.stderr) {
    throw new Error(`Error on ${client.filePath}:
  ${receipt.stderr}
    `);
  }
  const output = JSON.parse(receipt.stdout);
  if (output.error) {
    const { initialization } = output.error;
    if (initialization?.includes('\nNear:\n')) {
      const [error, trace] = initialization.split('\nNear:\n');
      let startLine = '';
      const matcher = /start_line: (\d+),/;
      const matches = matcher.exec(trace);
      if (matches) startLine = matches[1];
      throw new Error(`Error on ${client.filePath}:
    ${error}
    ${startLine ? `Near line ${startLine}` : ''}
    Raw trace:
    ${trace}
      `);
    }
    throw new Error(`Error on ${client.filePath}:
  ${JSON.stringify(output.error, null, 2)}
    `);
  }
}
