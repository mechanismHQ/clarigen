import {
  ClarityAbiType,
  cvToValue,
  AbiTypeTo,
  ClarityAbi,
} from '@clarigen/core';
import { evalRaw, NativeClarityBinProvider } from '@clarigen/native-bin';
import { ClarityAbiVariable, hexToCV } from 'micro-stacks/clarity';
import type { ContractMeta } from '../utils';

// export interface TypedAbiVariable<T extends ClarityAbiType>
//   extends ClarityAbiVariable {
//   type: T;
//   defaultValue: AbiTypeTo<T>;
// }
export type TypedAbiVariable<T> = ClarityAbiVariable & {
  defaultValue: T;
};
// export type TypedAbiVariable<T> = T extends ClarityAbiVariable ?
//   T['type'] extends ClarityAbiType ?
export type VariableType<T> = T extends ClarityAbiVariable ? T['type'] : never;

export async function getVariables({
  abi,
  contractIdentifier,
  provider,
}: {
  abi: ClarityAbi;
  contractIdentifier: string;
  provider: NativeClarityBinProvider;
}) {
  const variableTransforms = abi.variables.map((variable) => {
    return evalVariable({
      variable,
      provider,
      contractIdentifier,
    });
  });
  const variables = await Promise.all(variableTransforms);
  return variables;
}

export async function evalVariable<T extends ClarityAbiVariable>({
  contractIdentifier,
  variable,
  provider,
}: {
  contractIdentifier: string;
  variable: T;
  provider: NativeClarityBinProvider;
}) {
  const code = getEvalCode(variable);
  const result = await evalRaw({
    contractAddress: contractIdentifier,
    code,
    provider,
  });
  const resultCV = hexToCV(result.output_serialized);
  const value = cvToValue(resultCV, true);
  return {
    ...variable,
    defaultValue: value,
  };
}

// export async function

function getEvalCode(variable: ClarityAbiVariable) {
  const { access } = variable;
  if (access === 'variable') {
    return `(var-get ${variable.name})`;
  }
  return variable.name;
}

// export function serializeVariable(variable: TypedAbiVariable<any>) {
//   const { defaultValue, ...rest } = variable;
//   const lines = Object.keys(rest).map((key) => {
//     return `"${key}": ${JSON.stringify(rest[key])}`;
//   });
//   const valueLine = typeof defaultValue === 'bigint' ? `${defaultValue.toString()}n` : JSON.stringify()
// }
