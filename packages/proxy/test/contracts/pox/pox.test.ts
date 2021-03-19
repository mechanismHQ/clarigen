import { proxy } from '../../../src';
// import type { Transaction } from '../../../src/transaction';
// import { appmap } from '/contracts/appmap';
// import { pox, PoxContract } from '.';
import { pox } from './abi';
import { PoxContract } from './contract';
import { TestProvider, createClarityBin } from '../../../src/providers/test-provider';
// import { principalToString } from '../../../src/providers/test-provider/utils';
// import { ClarityType, PrincipalCV } from '@stacks/transactions';

const getContract = async () => {
  const clarityBin = await createClarityBin();
  const provider = await TestProvider.create({
    contractFilePath: 'test/contracts/pox/pox.clar',
    contractIdentifier: 'SP000000000000000000002Q6VF78.pox',
    clarityBin,
  });
  const contract = proxy<PoxContract>(pox, provider);
  return contract;
};

test('can call read only function', async () => {
  const contract = await getContract();
  const size = await contract.getRewardSetSize('u0');
  expect(size.value.toNumber()).toEqual(0);
});

// test('can call public function', async () => {
//   const contract = await getContract();
//   const changeTx: Transaction = contract.transferAdministrator(
//     'S1G2081040G2081040G2081040G208105NK8PE5'
//   );
//   const receipt = await changeTx.submit({ sender: 'ST1ESYCGJB5Z5NBHS39XPC70PGC14WAQK5XXNQYDW' });
//   const didTransfer = (await receipt.getResult()).value;
//   expect(didTransfer.type).toEqual(ClarityType.BoolTrue);
// });

// Get ABI for a contract!
// test.only('launch', async () => {
//   const provider = await TestProvider.create({
//     contractFilePath: 'test/contracts/appmap.clar',
//     contractIdentifier: 'S1G2081040G2081040G2081040G208105NK8PE5.appmap',
//   });
//   const receipt = await provider.provider.runCommand([
//     'launch',
//     provider.client.name,
//     provider.client.filePath,
//     provider.provider.dbFilePath,
//     '--output_analysis',
//   ]);
//   const abi = JSON.parse(receipt.stdout);
//   console.log(abi);
// });
