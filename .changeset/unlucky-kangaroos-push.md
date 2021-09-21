---
'@clarigen/cli': minor
'@clarigen/test': minor
---

Updates the CLI to use `BigInt` for account balances that come from Clarinet's `Devnet.toml`. This allows for much larger balances than supported by JS numbers.

This change is used downstream in `@clarigen/test`, in the `createNativeBin` function. You are now required to pass a `bigint` as the user's balance.
