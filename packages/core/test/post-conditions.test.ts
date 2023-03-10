import { createLPString, uintCV } from 'micro-stacks/clarity';
import {
  FungibleConditionCode,
  NonFungibleConditionCode,
  PostConditionType,
} from 'micro-stacks/transactions';
import { project } from 'demo-project';
import {
  AssetNames,
  createAssetInfo,
  makeFungiblePostCondition,
  makeNonFungiblePostCondition,
  NftAssetType,
  projectFactory,
} from '../src';
const devnet = projectFactory(project, 'devnet');

const contract = devnet.tester;

type Assets = AssetNames<typeof contract>;

// @ts-expect-error Type error for asset name
let assetName: Assets = 'incorrect-name';

assetName = 'ft';
assetName = 'nft';

// @ts-expect-error Invalid asset name
assetName = 'not-asset';

const [deployer, contractName] = contract.identifier.split('.');

test('can create NFT asset info', () => {
  const assetInfo = createAssetInfo(contract, 'nft');
  expect(assetInfo.assetName).toEqual(createLPString('nft'));
  expect(assetInfo.contractName).toEqual(createLPString(contractName));
});

test('throw if invalid asset name', () => {
  expect(() => {
    // @ts-expect-error Invalid asset name
    createAssetInfo(contract, 'non-asset');
  }).toThrow();
});

// @ts-expect-error Invalid asset type
const _nftId: NftAssetType<typeof contract> = 'asdf';

test('can create post condition', () => {
  const pc = makeNonFungiblePostCondition(
    contract,
    deployer,
    NonFungibleConditionCode.DoesNotOwn,
    1n
  );
  if (pc.conditionCode !== NonFungibleConditionCode.DoesNotOwn) {
    throw new Error('invalid');
  }
  expect(pc.assetName).toEqual(uintCV(1));
});

test('correct type errors', () => {
  expect(() => {
    makeNonFungiblePostCondition(
      contract,
      deployer,
      NonFungibleConditionCode.DoesNotOwn,
      // @ts-expect-error Should fail types
      'asdf'
    );
  }).toThrowError();
});

test('works for ft', () => {
  const pc = makeFungiblePostCondition(contract, deployer, FungibleConditionCode.Equal, 100);
  if (pc.conditionCode !== FungibleConditionCode.Equal) {
    throw new Error('Invalid');
  }
  if (pc.conditionType !== PostConditionType.Fungible) {
    throw 'Invalid';
  }
  expect(pc.assetInfo.assetName).toEqual(createLPString('ft'));
});
