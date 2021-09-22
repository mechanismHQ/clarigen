import {
  addressToString,
  ClarityAbiType,
  ClarityType,
  ClarityValue,
  PrincipalCV,
  parseToCV as _parseToCV,
  isClarityAbiTuple,
  tupleCV,
  isClarityAbiList,
  listCV,
  isClarityAbiOptional,
  noneCV,
  someCV,
} from '@stacks/transactions';

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
