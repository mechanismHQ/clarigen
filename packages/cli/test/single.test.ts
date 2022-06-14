import { SimpleInterface } from './abi/simple';
import { generateContractMeta } from '../src/generate/single';

test('can generate single file', () => {
  const code = generateContractMeta({
    abi: SimpleInterface,
    contractFile: '',
    contractName: 'simple',
    dirName: '',
    contractAddress: '',
    variables: [],
  });
  // console.log(code);
});
