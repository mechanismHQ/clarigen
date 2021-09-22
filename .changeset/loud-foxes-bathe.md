---
'@clarigen/core': patch
'@clarigen/test': patch
---

Adds the ability to specify a contract name manually when deploying test contracts. Previously, the contract name would be automatically generated from the contract's file.

For example, `my-contract.clar` would have the identifier `ST123.my-contract`. Now, in `TestProvider.fromContracts`, you can specify a name manually:

```ts
await TestProvider.fromContracts({
  ...contracts,
  myContract2: {
    ...contracts.myContract,
    name: 'my-contract-2',
  },
});
```
