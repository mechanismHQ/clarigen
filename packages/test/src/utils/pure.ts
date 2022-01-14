import {
  ContractCall,
  ContractCalls,
  CoreNodeEvent,
  cvToString,
  ResultAssets,
  cvToValue,
} from '@clarigen/core';
import { NativeClarityBinProvider } from '@clarigen/native-bin';
import {
  ClarityValue,
  hexToCV,
  ResponseCV,
  responseErrorCV,
  responseOkCV,
} from 'micro-stacks/clarity';
import { executeJson, getPrints } from '.';
import { Costs, evalJson } from './clarity-cli-adapter';
import { ok, err } from 'neverthrow';

function formatArguments(args: ClarityValue[]) {
  return args.map(arg => cvToString(arg));
}

function getIdentifier<T>(tx: ContractCall<T>) {
  return `${tx.contractAddress}.${tx.contractName}`;
}

function getLogs(stderr: string) {
  if (stderr === '') return [];
  return stderr.split('\n').map(line => line.slice(62));
}

export interface ReadOnlyResult<T> {
  value: T;
  clarityValue: ClarityValue;
  logs: string[];
  costs: Costs;
}

export async function ro<T>(
  tx: ContractCall<T>,
  bin: NativeClarityBinProvider
): Promise<ReadOnlyResult<T>> {
  const result = await evalJson({
    functionName: tx.function.name,
    args: formatArguments(tx.functionArgs),
    contractAddress: getIdentifier(tx),
    provider: bin,
  });
  const resultCV = hexToCV(result.output_serialized);
  const value = cvToValue(resultCV, true);
  return {
    value,
    clarityValue: resultCV,
    logs: getLogs(result.stderr),
    costs: result.costs,
  };
}

export interface PublicResultBase<T> {
  value: T;
  response: ResponseCV;
  isOk: boolean;
  logs: string[];
  costs: Costs;
}

export interface PublicResultErr<T> extends PublicResultBase<T> {
  value: T;
  isOk: false;
}

export interface PublicResultOk<T> extends PublicResultBase<T> {
  value: T;
  isOk: true;
  events: CoreNodeEvent[];
  assets: ResultAssets;
  prints: any[];
}

export type PublicResult<Ok, Err> = PublicResultOk<Ok> | PublicResultErr<Err>;

export async function tx<Ok, Err>({
  tx,
  senderAddress,
  bin,
}: {
  tx: ContractCalls.Public<Ok, Err>;
  senderAddress: string;
  bin: NativeClarityBinProvider;
}): Promise<PublicResult<Ok, Err>> {
  const result = await executeJson({
    contractAddress: getIdentifier(tx),
    senderAddress,
    provider: bin,
    functionName: tx.function.name,
    args: formatArguments(tx.functionArgs),
  });
  const resultCV = hexToCV(result.output_serialized);
  const value = cvToValue(resultCV);
  const baseReturn = {
    value,
    logs: getLogs(result.stderr),
    costs: result.costs,
  };
  if (result.success) {
    return {
      ...baseReturn,
      isOk: true,
      response: responseOkCV(resultCV),
      assets: result.assets,
      events: result.events,
      prints: getPrints(result.events),
    };
  }
  return {
    ...baseReturn,
    isOk: false,
    response: responseErrorCV(resultCV),
  };
}
