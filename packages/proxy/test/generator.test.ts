import { isClarityAbiResponse, isClarityAbiStringAscii } from '@stacks/transactions';
import { generateInterface, generateInterfaceFile } from '@clarion/proxy';

test('can generate an interface', async () => {
  const abi = await generateInterface({
    contractFile: 'test/contracts/simple/simple.clar',
  });
  const getNameFn = abi.functions.find(func => {
    return func.name === 'get-name';
  });
  console.log(abi);
  if (!getNameFn) throw new Error('Expected get-name fn');
  expect(getNameFn).toBeTruthy();
  expect(getNameFn.args.length).toEqual(0);
  const { type } = getNameFn.outputs;
  if (!isClarityAbiResponse(type)) throw new Error('Expected response type');
  const { ok } = type.response;
  if (!isClarityAbiStringAscii(ok)) throw new Error('Expected string-ascii result');
  console.log(JSON.stringify(abi, null, 2));
});

test('can generate interface file', async () => {
  const fileContents = await generateInterfaceFile({
    contractFile: 'test/contracts/simple/simple.clar',
  });
  console.log(fileContents);
});
