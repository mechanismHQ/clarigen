import type { ContractInstances } from '@clarigen/core';
import { echoInfo } from './echo';
import { nestedInfo } from './nested/nested';
export type { EchoContract } from './echo';
export type { NestedContract } from './nested/nested';

export type Contracts = ContractInstances<typeof contracts>;

export const contracts = {
  echo: echoInfo,
  nested: nestedInfo,
};

// prettier-ignore
export const accounts = {
  "deployer": {
    mnemonic: "fetch outside black test wash cover just actual execute nice door want airport betray quantum stamp fish act pen trust portion fatigue scissors vague",
    balance: 1000000000000000000000n,
    address: "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE",
  },
  "wallet_1": {
    mnemonic: "spoil sock coyote include verify comic jacket gain beauty tank flush victory illness edge reveal shallow plug hobby usual juice harsh pact wreck eight",
    balance: 1000000000000000000000n,
    address: "ST1J4G6RR643BCG8G8SR6M2D9Z9KXT2NJDRK3FBTK",
  },
  "wallet_2": {
    mnemonic: "arrange scale orient half ugly kid bike twin magnet joke hurt fiber ethics super receive version wreck media fluid much abstract reward street alter",
    balance: 1000000n,
    address: "ST20ATRN26N9P05V2F1RHFRV24X8C8M3W54E427B2",
  },
};
