import { Client, NativeClarityBinProvider } from '@blockstack/clarity';
import { getTempFilePath } from '@blockstack/clarity/lib/utils/fsUtil';
import { getDefaultBinaryFilePath } from '@blockstack/clarity-native-bin';
import { ClarityType, ClarityValue, addressToString, PrincipalCV } from '@stacks/transactions';
import { ResultAssets, Transaction } from '@clarigen/core';

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
  if (result.exitCode !== 0) {
    throw new Error(`Execution error: ${result.stderr}`);
  }
  // console.log('result.stderr', result.stderr);
  // console.log('result.stdout', result.stdout);
  const response: ExecuteResult = JSON.parse(result.stdout);
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
  if (!response.success) {
    throw new Error(response.error);
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

function principalToString(principal: PrincipalCV): string {
  if (principal.type === ClarityType.PrincipalStandard) {
    return addressToString(principal.address);
  } else if (principal.type === ClarityType.PrincipalContract) {
    const address = addressToString(principal.address);
    return `${address}.${principal.contractName.content}`;
  } else {
    throw new Error(`Unexpected principal data: ${JSON.stringify(principal)}`);
  }
}

export async function deployContract(client: Client, provider: NativeClarityBinProvider) {
  const receipt = await provider.runCommand([
    'launch',
    client.name,
    client.filePath,
    provider.dbFilePath,
    '--costs',
    '--assets',
  ]);
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

export function cvToValue(val: ClarityValue): any {
  switch (val.type) {
    case ClarityType.BoolTrue:
      return true;
    case ClarityType.BoolFalse:
      return false;
    case ClarityType.Int:
      return val.value.fromTwos(128).toNumber();
    case ClarityType.UInt:
      return val.value.toNumber();
    case ClarityType.Buffer:
      return `0x${val.buffer.toString('hex')}`;
    case ClarityType.OptionalNone:
      return null;
    case ClarityType.OptionalSome:
      return cvToValue(val.value);
    case ClarityType.ResponseErr:
      return cvToValue(val.value);
    case ClarityType.ResponseOk:
      return cvToValue(val.value);
    case ClarityType.PrincipalStandard:
    case ClarityType.PrincipalContract:
      return principalToString(val);
    case ClarityType.List:
      return val.list.map(v => cvToValue(v));
    case ClarityType.Tuple:
      const result: { [key: string]: any } = {};
      Object.keys(val.data).forEach(key => {
        result[key] = cvToValue(val.data[key]);
      });
      return result;
    case ClarityType.StringASCII:
      return val.data;
    case ClarityType.StringUTF8:
      return val.data;
  }
}

export async function tx<A, B>(tx: Transaction<A, B>, sender: string) {
  const receipt = await tx.submit({ sender });
  const result = await receipt.getResult();
  return result;
}
