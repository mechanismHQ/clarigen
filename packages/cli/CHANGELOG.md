# @clarigen/cli

## 1.0.0-next.21

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`a131614`](https://github.com/mechanismHQ/clarigen/commit/a1316142a5bec9e949dd6cacd3328fa2941e12fc) Thanks [@hstove](https://github.com/hstove)! - Updated CLI package to support all config living in `Clarinet.toml`

* [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`0d9414f`](https://github.com/mechanismHQ/clarigen/commit/0d9414fa8e09df10548a5000a37ac66f60f509fc) Thanks [@hstove](https://github.com/hstove)! - Moved internal package management from yarn to pnpm.

* Updated dependencies [[`a131614`](https://github.com/mechanismHQ/clarigen/commit/a1316142a5bec9e949dd6cacd3328fa2941e12fc), [`0d9414f`](https://github.com/mechanismHQ/clarigen/commit/0d9414fa8e09df10548a5000a37ac66f60f509fc)]:
  - @clarigen/claridocs@1.0.0-next.21
  - @clarigen/core@1.0.0-next.21
  - @clarigen/native-bin@1.0.0-next.21

## 1.0.0-next.20

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`078de12`](https://github.com/mechanismHQ/clarigen/commit/078de129265b9c88e2124c84cba12899614c3719) Thanks [@hstove](https://github.com/hstove)! - Fixed an issue when serializing variables

## 1.0.0-next.19

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`b8988e7`](https://github.com/mechanismHQ/clarigen/commit/b8988e7ec734324de005a7b271d0a03b4cec6d37) Thanks [@hstove](https://github.com/hstove)! - Updates the native `Response` type so that generics are properly included in both `Ok` and `Err` type.

  Also fixed a bug when generating the new output, where long arrays were improperly serialized.

- Updated dependencies [[`b8988e7`](https://github.com/mechanismHQ/clarigen/commit/b8988e7ec734324de005a7b271d0a03b4cec6d37)]:
  - @clarigen/core@1.0.0-next.19
  - @clarigen/claridocs@1.0.0-next.19
  - @clarigen/native-bin@1.0.0-next.19

## 1.0.0-next.18

### Patch Changes

- [`8ae1862`](https://github.com/mechanismHQ/clarigen/commit/8ae18623f3535550c1707642dbde9ec79ae87585) Thanks [@hstove](https://github.com/hstove)! - Created a new generated file type through `@clarigen/cli`. New types allow Clarigen to only need a "typed ABI" in order to generate all of the same functionality. This greatly improve simplicity and portability. This new generated file has zero dependencies, meaning it can be used in Deno.

- Updated dependencies [[`8ae1862`](https://github.com/mechanismHQ/clarigen/commit/8ae18623f3535550c1707642dbde9ec79ae87585)]:
  - @clarigen/claridocs@1.0.0-next.18
  - @clarigen/core@1.0.0-next.18
  - @clarigen/native-bin@1.0.0-next.18

## 1.0.0-next.17

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`1a94545`](https://github.com/mechanismHQ/clarigen/commit/1a94545e482d42cc842e241d5484c69bb9188e7c) Thanks [@hstove](https://github.com/hstove)! - Fixed a bug where the CLI exported invalid types for Response

- Updated dependencies [[`1a94545`](https://github.com/mechanismHQ/clarigen/commit/1a94545e482d42cc842e241d5484c69bb9188e7c)]:
  - @clarigen/claridocs@1.0.0-next.17
  - @clarigen/core@1.0.0-next.17
  - @clarigen/native-bin@1.0.0-next.17

## 1.0.0-next.16

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`f1cc407`](https://github.com/mechanismHQ/clarigen/commit/f1cc407fe3430e79468d38b5acdb60cf051ea5c5) Thanks [@hstove](https://github.com/hstove)! - Adds an index-level docs page when generating docs

- Updated dependencies [[`f1cc407`](https://github.com/mechanismHQ/clarigen/commit/f1cc407fe3430e79468d38b5acdb60cf051ea5c5)]:
  - @clarigen/claridocs@1.0.0-next.16
  - @clarigen/core@1.0.0-next.16
  - @clarigen/native-bin@1.0.0-next.16

## 1.0.0-next.15

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`c69a6c9`](https://github.com/mechanismHQ/clarigen/commit/c69a6c9b8c185f840f38759aa7a530ee54f85c57) Thanks [@hstove](https://github.com/hstove)! - Adds a new package, Claridocs! Claridocs will automatically parse comments from your contracts and generate a markdown file for every contract in your project.

- Updated dependencies [[`6916cb8`](https://github.com/mechanismHQ/clarigen/commit/6916cb8ea69715634399a4a48680323257c35719), [`c69a6c9`](https://github.com/mechanismHQ/clarigen/commit/c69a6c9b8c185f840f38759aa7a530ee54f85c57)]:
  - @clarigen/core@1.0.0-next.15
  - @clarigen/claridocs@1.0.0-next.15
  - @clarigen/native-bin@1.0.0-next.15

## 1.0.0-next.14

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`a585ecb`](https://github.com/mechanismHQ/clarigen/commit/a585ecb3eb44d2a7b6a6850dcc5f01f76ba43b3c) Thanks [@hstove](https://github.com/hstove)! - Moved to a native `Response` type, instead of from `neverthrow`

* Moves to a native `Response` type, instead of using the 'neverthrow' library.

* Updated dependencies [[`a585ecb`](https://github.com/mechanismHQ/clarigen/commit/a585ecb3eb44d2a7b6a6850dcc5f01f76ba43b3c)]:
  - @clarigen/core@1.0.0-next.14
  - @clarigen/native-bin@1.0.0-next.14

## 1.0.0-next.12

### Patch Changes

- Updated dependencies []:
  - @clarigen/native-bin@1.0.0-next.12

## 1.0.0-next.11

### Patch Changes

- Fixed an issue where some projects didn't run the correct build script in `prepublishonly`

- Updated dependencies []:
  - @clarigen/core@1.0.0-next.11
  - @clarigen/native-bin@1.0.0-next.11

## 1.0.0-next.10

### Patch Changes

- [`2e62568`](https://github.com/mechanismHQ/clarigen/commit/2e6256853efab622c3d61039c1d55073cb72ff17) Thanks [@hstove](https://github.com/hstove)! - Updates internal build processes with tsup and turborepo

- Updated dependencies [[`2e62568`](https://github.com/mechanismHQ/clarigen/commit/2e6256853efab622c3d61039c1d55073cb72ff17)]:
  - @clarigen/core@1.0.0-next.10
  - @clarigen/native-bin@1.0.0-next.10

## 1.0.0-next.9

### Patch Changes

- Updated dependencies []:
  - @clarigen/core@1.0.0-next.9
  - @clarigen/native-bin@1.0.0-next.9

## 1.0.0-next.8

### Patch Changes

- Updated dependencies [[`741c968`](https://github.com/mechanismHQ/clarigen/commit/741c9687ef5e11a26c80f02233905136403ac940), [`7b5ce6d`](https://github.com/mechanismHQ/clarigen/commit/7b5ce6db6460a313924a976e1cfaca3fdbb4dc49)]:
  - @clarigen/core@1.0.0-next.8
  - @clarigen/native-bin@1.0.0-next.8

## 1.0.0-next.7

### Patch Changes

- Manually constructs read-only fn call to include `tip` param.

- Updated dependencies []:
  - @clarigen/core@1.0.0-next.7
  - @clarigen/native-bin@1.0.0-next.7

## 1.0.0-next.6

### Patch Changes

- Updated dependencies []:
  - @clarigen/core@1.0.0-next.6
  - @clarigen/native-bin@1.0.0-next.6

## 1.0.0-next.4

### Patch Changes

- Updated dependencies []:
  - @clarigen/core@1.0.0-next.4
  - @clarigen/native-bin@1.0.0-next.4

## 1.0.0-next.3

### Patch Changes

- [`1727e49`](https://github.com/obylabs/clarigen/commit/1727e49ba456130115c310527c93c562a07f1716) Thanks [@hstove](https://github.com/hstove)! - Bumps `micro-stacks` version

- Updated dependencies [[`1727e49`](https://github.com/obylabs/clarigen/commit/1727e49ba456130115c310527c93c562a07f1716)]:
  - @clarigen/core@1.0.0-next.3
  - @clarigen/native-bin@1.0.0-next.3

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

### Patch Changes

- Updated dependencies []:
  - @clarigen/core@1.0.0-next.1
  - @clarigen/native-bin@1.0.0-next.1

## 1.0.0-next.0

### Major Changes

- [#28](https://github.com/obylabs/clarigen/pull/28) [`574834a`](https://github.com/obylabs/clarigen/commit/574834a950d8b8cfcff620c66f3f22b62c191c51) Thanks [@hstove](https://github.com/hstove)! - Migrates all packages to depend on `micro-stacks`. This allows for simplicity and much reduced bundle sizes.

  Most APIs do not change at all, however, there are some breaking changes:

  - The `buff` Clarity type now uses the `Uint8Array` native JS type, instead of `Buffer`
  - Some TypeScript types that came from `@stacks/transactions` will break, like the `PostCondition` type

### Patch Changes

- Updated dependencies [[`574834a`](https://github.com/obylabs/clarigen/commit/574834a950d8b8cfcff620c66f3f22b62c191c51)]:
  - @clarigen/core@1.0.0-next.0
  - @clarigen/native-bin@1.0.0-next.0

## 0.3.6

### Patch Changes

- [`354fe7d`](https://github.com/obylabs/clarigen/commit/354fe7dd0a1af7ed460e31b5a70753e16caab850) Thanks [@hstove](https://github.com/hstove)! - Contracts are now sorted using the `depends_on` property for Clarinet-integrated projects. Previously, contracts needed to be sorted in deploy order in `Clarinet.toml`.

## 0.3.4

### Patch Changes

- Updated dependencies [[`3f04d0d`](https://github.com/obylabs/clarigen/commit/3f04d0d5cf0e5e23e52ac2c6d598b08f6c0d58d1)]:
  - @clarigen/core@0.3.4
  - @clarigen/native-bin@0.3.4

## 0.3.3

### Patch Changes

- [`7278ff6`](https://github.com/obylabs/clarigen/commit/7278ff662c98a6723e9f26579684dd36f35cdeea) Thanks [@hstove](https://github.com/hstove)! - Fixed a bug where `native-bin` didn't work in node.js > 16.10.

- Updated dependencies [[`7278ff6`](https://github.com/obylabs/clarigen/commit/7278ff662c98a6723e9f26579684dd36f35cdeea)]:
  - @clarigen/native-bin@0.3.3

## 0.3.2

### Patch Changes

- [`529cff2`](https://github.com/obylabs/clarigen/commit/529cff2a42263ff801f4a20d62bf7adfbd92ee0a) Thanks [@hstove](https://github.com/hstove)! - Fixed a bug where contracts that printed output on contract deploys would throw an error. For example, this contract:

  ```clar
  (define-public (say-hi) (print "hello"))

  (say-hi)
  ```

  Would `print` when the contract deployed and cause an when Clarigen deployed it.

- Updated dependencies [[`529cff2`](https://github.com/obylabs/clarigen/commit/529cff2a42263ff801f4a20d62bf7adfbd92ee0a), [`d72e4e4`](https://github.com/obylabs/clarigen/commit/d72e4e4e160311d4ed39cf36f105ec9f0df92c81)]:
  - @clarigen/core@0.3.2
  - @clarigen/native-bin@0.3.2

## 0.3.1

### Patch Changes

- [`5a4e434`](https://github.com/obylabs/clarigen/commit/5a4e43484c9134db102a9ef8745a273a0c6c3018) Thanks [@hstove](https://github.com/hstove)! - Fixed an issue with integer conversion with clarity values. Resolved by updating `@stacks/transactions` dependency version

- Updated dependencies [[`5a4e434`](https://github.com/obylabs/clarigen/commit/5a4e43484c9134db102a9ef8745a273a0c6c3018)]:
  - @clarigen/core@0.3.1
  - @clarigen/native-bin@0.3.1

## 0.3.0

### Minor Changes

- [`31432eb`](https://github.com/obylabs/clarigen/commit/31432eb84947956deb64b392407050c59c2da409) Thanks [@hstove](https://github.com/hstove)! - Updates the CLI to use `BigInt` for account balances that come from Clarinet's `Devnet.toml`. This allows for much larger balances than supported by JS numbers.

  This change is used downstream in `@clarigen/test`, in the `createNativeBin` function. You are now required to pass a `bigint` as the user's balance.

## 0.2.7

### Patch Changes

- [`d5d9dc6`](https://github.com/obylabs/clarigen/commit/d5d9dc6b039bfb7c5e39d294594b753bb924b435) Thanks [@hstove](https://github.com/hstove)! - Fixed a bug when re-installing the native bin from a local file

* [`d3fa0e5`](https://github.com/obylabs/clarigen/commit/d3fa0e5478893340a4466bba76b5188c7aea114f) Thanks [@hstove](https://github.com/hstove)! - Added `@oclif/command` and `@oclif/plugin-help` to dependencies for CLI

* Updated dependencies [[`d5d9dc6`](https://github.com/obylabs/clarigen/commit/d5d9dc6b039bfb7c5e39d294594b753bb924b435)]:
  - @clarigen/native-bin@0.2.7

## 0.2.5

### Patch Changes

- [`88f9e16`](https://github.com/obylabs/clarigen/commit/88f9e16db5cb983e78d087241d5b47868629e5d7) Thanks [@hstove](https://github.com/hstove)! - Fixed packaging to support `clarigen` bin file in external repos

## 0.2.4

### Patch Changes

- [`227cc16`](https://github.com/obylabs/clarigen/commit/227cc16c7fad3e41f15fb24d4d11f0ea32e200a3) Thanks [@hstove](https://github.com/hstove)! - Updated CLI README.md to only include `clarigen` command

## 0.2.3

### Patch Changes

- [`3e68eb1`](https://github.com/obylabs/clarigen/commit/3e68eb107c19c71af536a42d8120ac9e9a3b2c78) Thanks [@hstove](https://github.com/hstove)! - Fixed CI publish script

- Updated dependencies [[`3e68eb1`](https://github.com/obylabs/clarigen/commit/3e68eb107c19c71af536a42d8120ac9e9a3b2c78)]:
  - @clarigen/native-bin@0.2.3
  - @clarigen/core@0.2.3

## 0.2.2

### Patch Changes

- [`a375c62`](https://github.com/obylabs/clarigen/commit/a375c622395b580821c0e53281ddd8233ccadf65) Thanks [@hstove](https://github.com/hstove)! - Fixed a typo in `post-install` for `native-bin`, which pointed to the wrong compiled file.

- Updated dependencies [[`a375c62`](https://github.com/obylabs/clarigen/commit/a375c622395b580821c0e53281ddd8233ccadf65)]:
  - @clarigen/native-bin@0.2.2

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

### Patch Changes

- Updated dependencies [fd1b36b]
  - @clarigen/core@0.2.0
  - @clarigen/native-bin@0.2.0
