import { publicKeyToStxAddress, StacksNetworkVersion } from 'micro-stacks/crypto';
import { getPublicKeyFromStacksPrivateKey, makeRandomPrivKey } from 'micro-stacks/transactions';
export * from './clarity-cli-adapter';
export * from './util-contract';
export * from './coverage';

export function makeRandomAddress(
  version: StacksNetworkVersion = StacksNetworkVersion.testnetP2PKH
) {
  const privateKey = makeRandomPrivKey();
  const publicKey = getPublicKeyFromStacksPrivateKey(privateKey);
  const address = publicKeyToStxAddress(publicKey.data, version);
  return address;
}
