import {
  isMainnetAddress,
  parseReadOnlyResponse,
  ReadOnlyFunctionOptions,
  ReadOnlyFunctionResponse,
} from 'micro-stacks/api';
import { ClarityValue, cvToHex } from 'micro-stacks/clarity';
import { fetchPrivate } from 'micro-stacks/common';

export type ReadOnlyOptions = Omit<ReadOnlyFunctionOptions, 'network'> & {
  url: string;
};

/**
 * Calls a read only function from a contract interface
 *
 * @param options - the options object
 *
 * Returns an ClarityValue
 *
 */
export async function callReadOnlyFunction<T extends ClarityValue>(
  options: ReadOnlyOptions
): Promise<T> {
  const {
    contractName,
    contractAddress,
    functionName,
    functionArgs,
    senderAddress = contractAddress,
    tip,
    url,
  } = options;

  let fullUrl = `${url}/v2/contracts/call-read/${contractAddress}/${contractName}/${encodeURIComponent(
    functionName
  )}`;
  if (tip) {
    fullUrl += `?tip=${tip}`;
  }

  const body = JSON.stringify({
    sender: senderAddress,
    arguments: functionArgs.map(arg => (typeof arg === 'string' ? arg : cvToHex(arg))),
  });

  const response = await fetchPrivate(fullUrl, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    let msg = '';
    try {
      msg = await response.text();
    } catch (error) {}
    throw new Error(
      `Error calling read-only function. Response ${response.status}: ${response.statusText}. Attempted to fetch ${fullUrl} and failed with the message: "${msg}"`
    );
  }

  return parseReadOnlyResponse<T>((await response.json()) as ReadOnlyFunctionResponse);
}
