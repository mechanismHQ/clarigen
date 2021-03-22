import type * as Clarity from '@stacks/transactions';
import type {
  ClarityAbi as _ClarityAbi,
  ClarityAbiType,
  ClarityAbiTypeTuple,
} from '@stacks/transactions';

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
}
