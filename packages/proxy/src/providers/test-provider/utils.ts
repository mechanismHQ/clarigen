import { NativeClarityBinProvider } from '@blockstack/clarity';

interface ExecuteOk {
  success: true;
  events: any[];
  result_raw: string;
}

interface ExecuteErr {
  success: false;
  result_raw: string;
  events: null;
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
    'execute_json',
    provider.dbFilePath,
    contractAddress,
    functionName,
    senderAddress,
    ...args,
  ]);
  if (result.exitCode !== 0 || result.stderr) {
    throw new Error(`Execution error: ${result.stderr}`);
  }
  const response: ExecuteResult = JSON.parse(result.stdout);
  return response;
};

interface EvalOk {
  success: true;
  result_raw: string;
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
    ['eval_at_chaintip_json', contractAddress, provider.dbFilePath],
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
