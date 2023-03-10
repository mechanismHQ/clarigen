import { AssetInfo } from 'micro-stacks/clarity';
import { IntegerType } from 'micro-stacks/common';
import {
  createAssetInfo as _createAssetInfo,
  FungibleConditionCode,
  makeContractFungiblePostCondition,
  makeContractNonFungiblePostCondition,
  makeStandardFungiblePostCondition,
  makeStandardNonFungiblePostCondition,
  NonFungibleConditionCode,
  PostCondition,
} from 'micro-stacks/transactions';
import type { ClarityAbiType, TypedAbi } from './abi-types';
import { AbiTypeTo, CVInput, parseToCV, ReadonlyTuple } from './clarity-types';
import type { FullContract } from './factory-types';

type AbiWithAssets = Pick<
  FullContract<TypedAbi>,
  'non_fungible_tokens' | 'fungible_tokens' | 'identifier'
>;

export type AssetNames<T extends AbiWithAssets> =
  | T['non_fungible_tokens'][number]['name']
  | T['fungible_tokens'][number]['name'];

export function createAssetInfo<T extends AbiWithAssets>(
  contract: T,
  asset: AssetNames<T>
): AssetInfo {
  if (!('identifier' in contract)) {
    throw new Error('Invalid contract');
  }
  const [addr, name] = contract.identifier.split('.');
  for (const nft of contract.non_fungible_tokens) {
    if (nft.name === asset) {
      return _createAssetInfo(addr, name, nft.name);
    }
  }
  for (const ft of contract.fungible_tokens) {
    if (ft.name === asset) {
      return _createAssetInfo(addr, name, ft.name);
    }
  }
  throw new Error(`Invalid asset: "${asset}" is not an asset in contract.`);
}

export type NftAssetType<T extends AbiWithAssets> = T['non_fungible_tokens'][0] extends {
  type: infer Type;
}
  ? Type extends ClarityAbiType | ReadonlyTuple
    ? AbiTypeTo<Type>
    : never
  : never;

export function makeNonFungiblePostCondition<T extends AbiWithAssets>(
  contract: T,
  sender: string,
  condition: NonFungibleConditionCode,
  value: NftAssetType<T>
): PostCondition {
  const [addr, name] = sender.split('.');
  const [nftType] = contract.non_fungible_tokens;
  const asset = createAssetInfo(contract, nftType.name);
  const abiType = nftType.type;
  const cv = parseToCV(value as CVInput, abiType);
  if (typeof name === 'undefined') {
    return makeStandardNonFungiblePostCondition(addr, condition, asset, cv);
  } else {
    return makeContractNonFungiblePostCondition(addr, name, condition, asset, cv);
  }
}

export function makeFungiblePostCondition<T extends AbiWithAssets>(
  contract: T,
  sender: string,
  condition: FungibleConditionCode,
  amount: IntegerType
): PostCondition {
  const [addr, name] = sender.split('.');
  const [ftType] = contract.fungible_tokens;
  const asset = createAssetInfo(contract, ftType.name);
  if (typeof name === 'undefined') {
    return makeStandardFungiblePostCondition(addr, condition, amount, asset);
  } else {
    return makeContractFungiblePostCondition(addr, name, condition, amount, asset);
  }
}
