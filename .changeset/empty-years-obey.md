---
'@clarigen/core': patch
'@clarigen/node': patch
'@clarigen/web': patch
---

Adds helper methods for creating post conditions for a contract.

```ts
import {
  createAssetInfo,
  makeNonFungiblePostCondition,
  makeFungiblePostCondition,
} from '@clarigen/core';
import { contract } from './contracts';

// create asset info by specifying the name of the asset
createAssetInfo(contract, 'names');

makeNonFungiblePostCondition(contract, sender, NFTCode.DoesNotOwn, 1n);

makeFungiblePostCondition(contract, sender, FTCode.Equals, 1000n);
```
