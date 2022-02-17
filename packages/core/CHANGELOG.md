# @clarigen/core

## 1.0.0-next.6

### Patch Changes

- Adds `tip=latest` to read-only calls for node and web

## 1.0.0-next.4

### Patch Changes

- Exports `makeContracts` in core package

## 1.0.0-next.3

### Patch Changes

- [`1727e49`](https://github.com/obylabs/clarigen/commit/1727e49ba456130115c310527c93c562a07f1716) Thanks [@hstove](https://github.com/hstove)! - Bumps `micro-stacks` version

## 1.0.0-next.1

### Major Changes

- Updates the core types built by Clarigen to a more flexible approach. Previously, types were built such the API for returning info from a contract function was supposed to be identical. Here's what types used to look like:

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

## 1.0.0-next.0

### Major Changes

- [#28](https://github.com/obylabs/clarigen/pull/28) [`574834a`](https://github.com/obylabs/clarigen/commit/574834a950d8b8cfcff620c66f3f22b62c191c51) Thanks [@hstove](https://github.com/hstove)! - Migrates all packages to depend on `micro-stacks`. This allows for simplicity and much reduced bundle sizes.

  Most APIs do not change at all, however, there are some breaking changes:

  - The `buff` Clarity type now uses the `Uint8Array` native JS type, instead of `Buffer`
  - Some TypeScript types that came from `@stacks/transactions` will break, like the `PostCondition` type

## 0.3.4

### Patch Changes

- [`3f04d0d`](https://github.com/obylabs/clarigen/commit/3f04d0d5cf0e5e23e52ac2c6d598b08f6c0d58d1) Thanks [@hstove](https://github.com/hstove)! - Adds support for the `sponsored` flag when signing a transaction

## 0.3.2

### Patch Changes

- [`529cff2`](https://github.com/obylabs/clarigen/commit/529cff2a42263ff801f4a20d62bf7adfbd92ee0a) Thanks [@hstove](https://github.com/hstove)! - Fixed a bug where contracts that printed output on contract deploys would throw an error. For example, this contract:

  ```clar
  (define-public (say-hi) (print "hello"))

  (say-hi)
  ```

  Would `print` when the contract deployed and cause an when Clarigen deployed it.

* [`d72e4e4`](https://github.com/obylabs/clarigen/commit/d72e4e4e160311d4ed39cf36f105ec9f0df92c81) Thanks [@hstove](https://github.com/hstove)! - Adds the ability to specify a contract name manually when deploying test contracts. Previously, the contract name would be automatically generated from the contract's file.

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

## 0.3.1

### Patch Changes

- [`5a4e434`](https://github.com/obylabs/clarigen/commit/5a4e43484c9134db102a9ef8745a273a0c6c3018) Thanks [@hstove](https://github.com/hstove)! - Fixed an issue with integer conversion with clarity values. Resolved by updating `@stacks/transactions` dependency version

## 0.2.3

### Patch Changes

- [`3e68eb1`](https://github.com/obylabs/clarigen/commit/3e68eb107c19c71af536a42d8120ac9e9a3b2c78) Thanks [@hstove](https://github.com/hstove)! - Fixed CI publish script

## 0.2.0

### Minor Changes

- fd1b36b: This version contains a number of big changes!

  My favorite addition is the addition of a `@clarigen/native-bin` package. This removes the need to manually build and specify your local version of the `clarity-cli` binary. Most of this code was taken from the `@blockstack/clarity-native-bin` library. Users on Apple Silicon will also automatically download a pre-built binary (which was not previously available).

  These changes should really improve DX for project setup, as well as the ability to run Clarigen in CI.

  Other changes:

  - **Breaking change** JS types for functions that return `uint` or `int` types now use the `BigInt` native JavaScript type.
    - Although this is a breaking change, this is not a major update. Clarigen is still 0.x and is not in wide use.
  - **Breaking change**: Projects that have a `clarinet` configuration now look for the `Devnet.toml` file (instead of `Development.toml`)
  - Clarity type conversion (between hex and JS) has been consolidated into the `core` library
  - Bug fixes for boolean type conversion for function parameters
  - Added `get-stx-balance` test utility function
  - Added util for getting boot contract identifiers
  - `clarity-cli` is now launched in testnet mode by default
  - Added changesets for better release management
  - Added Github Actions CI to this package
