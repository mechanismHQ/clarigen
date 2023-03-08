import { uintCV } from 'micro-stacks/clarity';
import { NonFungibleConditionCode } from 'micro-stacks/transactions';
import { project, contracts } from 'demo-project';
import {
  AssetNames,
  createAssetInfo,
  makeNonFungiblePostCondition,
  NftAssets,
  NftAssetType,
  projectFactory,
} from '../src';
const devnet = projectFactory(project, 'devnet');

const contract = devnet.tester;

const nft = contract.non_fungible_tokens[0];

const fn = contract.roResp;
fn.name;
fn({
  returnErr: true,
});
// fn()

type Assets = AssetNames<typeof contract>;

type A2 = (typeof contract)['non_fungible_tokens'][number]['name'];

type NftA = NftAssets<typeof contract>;

test('can create NFT asset info', () => {
  const assetInfo = createAssetInfo(contract, 'nft');
});

type NftA2 = NftAssetType<typeof contract>;

type Nft0 = (typeof contract)['non_fungible_tokens'][0];

test('can create post condition', () => {
  const [deployer] = contract.identifier.split('.');
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
