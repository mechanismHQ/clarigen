import type * as Clarity from '@stacks/transactions';
import {
  addressToString,
  ClarityAbi as _ClarityAbi,
  ClarityAbiType,
  ClarityAbiTypeTuple,
  ClarityType,
  ClarityValue,
  PrincipalCV,
} from '@stacks/transactions';
import { Result } from 'neverthrow';

export interface ClarityAbiMap {
  name: string;
  key:
    | {
        name: string;
        type: ClarityAbiType;
      }[]
    | ClarityAbiTypeTuple
    | ClarityAbiType;
  value:
    | {
        name: string;
        type: ClarityAbiType;
      }[]
    | ClarityAbiTypeTuple
    | ClarityAbiType;
}

export interface ClarityAbi extends Omit<_ClarityAbi, 'maps'> {
  maps: ClarityAbiMap[];
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ClarityTypes {
  export type BooleanCV = Clarity.BooleanCV;
  export type TrueCV = Clarity.TrueCV;
  export type FalseCV = Clarity.FalseCV;
  export type IntCV = Clarity.IntCV;
  export type UIntCV = Clarity.UIntCV;
  export type BufferCV = Clarity.BufferCV;
  export type OptionalCV = Clarity.OptionalCV;
  export type NoneCV = Clarity.NoneCV;
  export type SomeCV = Clarity.SomeCV;
  export type ResponseCV = Clarity.ResponseCV;
  export type ResponseOkCV = Clarity.ResponseOkCV;
  export type ResponseErrorCV = Clarity.ResponseErrorCV;
  export type PrincipalCV = Clarity.PrincipalCV;
  export type StandardPrincipalCV = Clarity.StandardPrincipalCV;
  export type ContractPrincipalCV = Clarity.ContractPrincipalCV;
  export type ListCV = Clarity.ListCV;
  export type TupleCV = Clarity.TupleCV;
  export type StringAsciiCV = Clarity.StringAsciiCV;
  export type StringUtf8CV = Clarity.StringUtf8CV;
  export type Response<Ok, Err> = Result<Ok, Err>;
}

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
