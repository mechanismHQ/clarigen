import { Response, ContractCalls } from '@clarigen/core';

// prettier-ignore
export interface WrappedBitcoinContract {
  addPrincipalToRole: (roleToAdd: number | bigint, principalToAdd: string) => ContractCalls.Public<boolean, bigint>;
  burnTokens: (burnAmount: number | bigint, burnFrom: string) => ContractCalls.Public<boolean, bigint>;
  initialize: (nameToSet: string, symbolToSet: string, decimalsToSet: number | bigint, initialOwner: string) => ContractCalls.Public<boolean, bigint>;
  mintTokens: (mintAmount: number | bigint, mintTo: string) => ContractCalls.Public<boolean, bigint>;
  removePrincipalFromRole: (roleToRemove: number | bigint, principalToRemove: string) => ContractCalls.Public<boolean, bigint>;
  revokeTokens: (revokeAmount: number | bigint, revokeFrom: string, revokeTo: string) => ContractCalls.Public<boolean, bigint>;
  setTokenUri: (updatedUri: string) => ContractCalls.Public<boolean, bigint>;
  transfer: (amount: number | bigint, sender: string, recipient: string, memo: Uint8Array | null) => ContractCalls.Public<boolean, bigint>;
  updateBlacklisted: (principalToUpdate: string, setBlacklisted: boolean) => ContractCalls.Public<boolean, bigint>;
  detectTransferRestriction: (amount: number | bigint, sender: string, recipient: string) => ContractCalls.ReadOnly<Response<bigint, bigint>>;
  getBalance: (owner: string) => ContractCalls.ReadOnly<Response<bigint, null>>;
  getDecimals: () => ContractCalls.ReadOnly<Response<bigint, null>>;
  getName: () => ContractCalls.ReadOnly<Response<string, null>>;
  getSymbol: () => ContractCalls.ReadOnly<Response<string, null>>;
  getTokenUri: () => ContractCalls.ReadOnly<Response<string | null, null>>;
  getTotalSupply: () => ContractCalls.ReadOnly<Response<bigint, null>>;
  hasRole: (roleToCheck: number | bigint, principalToCheck: string) => ContractCalls.ReadOnly<boolean>;
  isBlacklisted: (principalToCheck: string) => ContractCalls.ReadOnly<boolean>;
  messageForRestriction: (restrictionCode: number | bigint) => ContractCalls.ReadOnly<Response<string, null>>;
  blacklist: (key: {
  "account": string
    }) => ContractCalls.Map<{
  "account": string
    }, {
  "blacklisted": boolean
    }>;
  roles: (key: {
  "account": string;
  "role": bigint
    }) => ContractCalls.Map<{
  "account": string;
  "role": bigint
    }, {
  "allowed": boolean
    }>;
}
