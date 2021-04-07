import { TestProvider, createClarityBin } from '../src';
import { simpleContract as simpleProxy } from './contracts/simple';

const getContract = async () => {
  const clarityBin = await createClarityBin();
  const provider = await TestProvider.create({
    contractFilePath: 'test/contracts/simple/simple.clar',
    contractIdentifier: 'S1G2081040G2081040G2081040G208105NK8PE5.simple',
    clarityBin,
  });
  const contract = simpleProxy(provider);
  return contract;
};

test('can call public function', async () => {
  const contract = await getContract();
  const tx = contract.getName();
  const receipt = await tx.submit({ sender: 'ST1ESYCGJB5Z5NBHS39XPC70PGC14WAQK5XXNQYDW' });
  const result = await receipt.getResult();
  if (!result.isOk) throw 'Expected ok';
  expect(result.value).toEqual('hello, world');
});

test('can call a read-only function', async () => {
  const contract = await getContract();
  const num = await contract.getNumber();
  expect(num).toEqual(1);
});
