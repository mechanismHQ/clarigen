import { NativeClarityBinProvider, Receipt } from '@blockstack/clarity';
import {
  ClarityAbiFunction,
  ClarityAbiType,
} from '@stacks/transactions/dist/transactions/src/contract-abi';
// import { principalCV } from '@stacks/transactions/dist/transactions/src/clarity/types/principalCV.js';
import {
  ClarityValue,
  addressToString,
  ClarityType,
  PrincipalCV,
  trueCV,
  contractPrincipalCV,
  standardPrincipalCV,
  falseCV,
} from '@stacks/transactions';
// export { principalToString } from '@stacks/transactions/dist/transactions/src/clarity/types/principalCV';

// export const principalToString = _principalToString;
export function principalToString(principal: PrincipalCV): string {
  if (principal.type === ClarityType.PrincipalStandard) {
    return addressToString(principal.address);
  } else if (principal.type === ClarityType.PrincipalContract) {
    const address = addressToString(principal.address);
    return `${address}.${principal.contractName.content}`;
  } else {
    throw new Error(`Unexpected principal data: ${JSON.stringify(principal)}`);
  }
}

function principalCV(principal: string): PrincipalCV {
  if (principal.includes('.')) {
    const [address, contractName] = principal.split('.');
    return contractPrincipalCV(address, contractName);
  } else {
    return standardPrincipalCV(principal);
  }
}

export const receiptToCV = (receipt: Receipt, func: ClarityAbiFunction): ClarityValue => {
  const { outputs } = func;
  let { result } = receipt;
  if (!result) {
    // TODO: error result
    return trueCV();
  }
  if (func.access === 'public') {
    result = result.split('\n')[0].slice('Transaction executed and committed. Returned: '.length);
  }
  if (typeof outputs.type === 'object') {
    if ('response' in outputs.type) {
      return resultToCV(result, outputs.type.response.ok);
    }
  }
  return resultToCV(result, outputs.type);
};

const resultToCV = (result: string, type: ClarityAbiType) => {
  if (type === 'principal') {
    return principalCV(result);
  }
  if (type === 'bool') {
    return result === 'true' ? trueCV() : falseCV();
  }
  // TODO: all values should be handled
  return trueCV();
};

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
