import {
  ContractCall,
  ContractCalls,
  CoreNodeEvent,
  cvToString,
  ResultAssets,
  cvToValue,
  Response,
  filterEvents,
  CoreNodeEventType,
} from '@clarigen/core';
import {
  NativeClarityBinProvider,
  evalRaw,
  evalJson,
  Eval,
  Costs,
  executeJson,
} from '@clarigen/native-bin';
import {
  ClarityValue,
  hexToCV,
  ResponseCV,
  responseErrorCV,
  responseOkCV,
} from 'micro-stacks/clarity';

export function getPrints(events: CoreNodeEvent[]) {
  return filterEvents(events, CoreNodeEventType.ContractEvent).map(e => {
    const hex = e.contract_event.raw_value;
    const cv = hexToCV(hex);
    return cvToValue(cv);
  });
}

function formatArguments(args: ClarityValue[]) {
  return args.map(arg => cvToString(arg));
}

function getIdentifier(tx: { contractAddress: string; contractName: string }) {
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

function makeEvalResult<T>(result: Eval): ReadOnlyResult<T> {
  const resultCV = hexToCV(result.output_serialized);
  const value = cvToValue(resultCV, true);
  return {
    value,
    clarityValue: resultCV,
    logs: getLogs(result.stderr),
    costs: result.costs,
  };
}

export async function ro<T>({
  tx,
  bin,
  coverageFolder,
}: {
  tx: ContractCall<T>;
  bin: NativeClarityBinProvider;
  coverageFolder?: string;
}): Promise<ReadOnlyResult<T>> {
  const result = await evalJson({
    functionName: tx.function.name,
    args: formatArguments(tx.functionArgs),
    contractAddress: getIdentifier(tx),
    provider: bin,
    coverageFolder,
  });
  return makeEvalResult(result);
}

export async function evalCode<T>({
  contractAddress,
  code,
  bin,
  coverageFolder,
}: {
  contractAddress: string;
  code: string;
  bin: NativeClarityBinProvider;
  coverageFolder?: string;
}): Promise<ReadOnlyResult<T>> {
  const result = await evalRaw({
    contractAddress,
    code,
    provider: bin,
    coverageFolder,
  });
  return makeEvalResult(result);
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
  coverageFolder,
}: {
  tx: ContractCalls.Public<Ok, Err>;
  senderAddress: string;
  bin: NativeClarityBinProvider;
  coverageFolder?: string;
}): Promise<PublicResult<Ok, Err>> {
  const result = await executeJson({
    contractAddress: getIdentifier(tx),
    senderAddress,
    provider: bin,
    functionName: tx.function.name,
    args: formatArguments(tx.functionArgs),
    coverageFolder,
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

export async function mapGet<T extends ContractCalls.Map<any, Val>, Val>({
  map,
  bin,
}: {
  map: T;
  bin: NativeClarityBinProvider;
}): Promise<Val | null> {
  const code = `(map-get? ${map.map.name} ${cvToString(map.key)})`;
  const result = await evalCode({
    contractAddress: getIdentifier(map),
    code,
    bin,
  });
  return result.value as Val | null;
}
