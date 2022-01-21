---
'@clarigen/cli': major
'@clarigen/core': major
---

Updates the core types built by Clarigen to a more flexible approach. Previously, types were built such the API for returning info from a contract function was supposed to be identical. Here's what types used to look like:

```typescript
import { ClarityTypes, Transaction } from '@clarigen/core';

// prettier-ignore
export interface MyContract {
  // public:
  addNum: (amount: number | bigint) => Transaction<bigint, bigint>;
  // read-only:
  getNum: () => Promise<bigint>;
}
```

This approach allowed for a tight DX in the "common" use cases, but it didn't work well in practice. For example, the core `Transaction` type ended up being split into a big discriminated type to account for the different behaviors in different environments. To deal with that, each package exposed a helper method (i.e. `tx`) to return the appropriate types.

Similarly, for read-only functions, this lacked flexibility. You could get the raw return value, but you couldn't get logs or costs, which are critical in a testing environment. You also couldn't call a public function in a read-only context, which is a valid thing to do.

Now, Clarigen contracts return a very generic type, which allows for maximum flexibility in any given environment. Here's what types look like now:

```typescript
export interface MyContract {
  myPublicFn: () => ContractCalls.Public<boolean, bigint>;
  myReadFn: () => ContractCalls.ReadOnly<bigint>;
}
```

These new types are not async - they return generic data that works across every environment. Here's the Typescript interface which these functions return:

```typescript
export interface ContractCall<T> {
  function: ClarityAbiFunction;
  nativeArgs: any[];
  functionArgs: ClarityValue[];
  contractAddress: string;
  contractName: string;
}
```

With this generic information, Clarigen packages for any environment can use this data to return the right result. It also allows for better code re-use, because you can write helper function to construct the `ContractCall` and use it anywhere.

This is a big breaking change, and you'll have to re-write your code for these new types. The APIs aren't too different, so it should be an easy migration. Feel free to see examples and docs for each package to understand the new APIs.
