// import { proxy } from '../src';
// import type { Transaction } from '../src/transaction';
// import { appmap } from './contracts/appmap/abi';
// import { AppMapContract } from './contracts/appmap/interface';
import { TestProvider } from '../src/providers/test-provider';
// import { principalToString } from '../src/providers/test-provider/utils';
// import { ClarityType, PrincipalCV } from '@stacks/transactions';
import { proxy as simpleProxy } from './contracts/simple';

const getContract = async () => {
  const provider = await TestProvider.create({
    contractFilePath: 'test/contracts/simple/simple.clar',
    contractIdentifier: 'S1G2081040G2081040G2081040G208105NK8PE5.simple',
  });
  // const contract = proxy<AppMapContract>(appmap, provider);
  const contract = simpleProxy(provider);
  return contract;
};

test('can call public function', async () => {
  const contract = await getContract();
  const tx = contract.getName();
  const receipt = await tx.submit({ sender: 'ST1ESYCGJB5Z5NBHS39XPC70PGC14WAQK5XXNQYDW' });
  const result = await receipt.getResult();
  console.log(result);
  if (!result.isOk) throw 'Expected ok';
  expect(result.value.data).toEqual('hello, world');
});

// test('can call read only function', async () => {
//   const contract = await getContract();
//   const principal: PrincipalCV = await contract.getAdministrator();
//   const address = principalToString(principal);
//   expect(address).toEqual('ST1ESYCGJB5Z5NBHS39XPC70PGC14WAQK5XXNQYDW');
// });

// test('can call public function', async () => {
//   const contract = await getContract();
//   const changeTx = contract.transferAdministrator('S1G2081040G2081040G2081040G208105NK8PE5');
//   const receipt = await changeTx.submit({ sender: 'ST1ESYCGJB5Z5NBHS39XPC70PGC14WAQK5XXNQYDW' });
//   const didTransfer = (await receipt.getResult()).value;
//   expect(didTransfer.type).toEqual(ClarityType.BoolTrue);
// });
