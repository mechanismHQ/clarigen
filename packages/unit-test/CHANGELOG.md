# @clarigen/test

## 1.0.0-next.14

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`a585ecb`](https://github.com/mechanismHQ/clarigen/commit/a585ecb3eb44d2a7b6a6850dcc5f01f76ba43b3c) Thanks [@hstove](https://github.com/hstove)! - Moved to a native `Response` type, instead of from `neverthrow`

* Moves to a native `Response` type, instead of using the 'neverthrow' library.

* Updated dependencies [[`a585ecb`](https://github.com/mechanismHQ/clarigen/commit/a585ecb3eb44d2a7b6a6850dcc5f01f76ba43b3c)]:
  - @clarigen/core@1.0.0-next.14
  - @clarigen/native-bin@1.0.0-next.14

## 1.0.0-next.13

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`faa6f3e`](https://github.com/mechanismHQ/clarigen/commit/faa6f3e0b174732e8c9887a711af7e2ece6b258d) Thanks [@hstove](https://github.com/hstove)! - Fixed an issue when passing accounts to `TestProvider.fromContracts`

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

- [`741c968`](https://github.com/mechanismHQ/clarigen/commit/741c9687ef5e11a26c80f02233905136403ac940) Thanks [@hstove](https://github.com/hstove)! - Fixed an issue where deploying contracts in the test adapter didn't use the contracts specified name. Instead, it inferred the contract name from the contract file.

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

### Minor Changes

- The `@clarigen/test` package has been updated for the new v1 Clarigen types.

  You can now more easily get logs and costs in function calls. Getting logs in a read-only call was not even possible previously without janky environment variables.

  Also new are native getters for any maps in your contract, as well as support for arbitrary code execution.

  Here's a code sample of what's new:

  ```typescript
  import { TestProvider } from '@clarigen/test';
  import { contracts, MyContract } from '../src/clarigen';

  let t: TestProvider;
  let contract: MyContract;

  beforeAll(async () => {
    const { deployed, provider } = await TestProvider.fromContracts(contracts);
    t = provider;
  });

  // sample contract:
  // (define-public (public-fn) (ok true))
  // (define-read-only (read-fn (with-ok bool)) (if with-ok (ok u1) (err u0)))
  // (define-map my-map uint bool)

  // calling public fns
  const txReceipt = await t.txOk(contract.publicFn(), alice);

  // read-only (ro) functions
  const roReceipt = await t.ro(contract.readFn());
  console.log(roReceipt.logs);
  console.log(roReceipt.costs);
  console.log(roReceipt.value);

  // helpers for getting the value of a read-only fn
  const response = await t.rov(contract.readFn(true)); // Response<bigint, bigint>
  // helpers for asserting and getting an ok/err value
  const okVal = await t.rovOk(contract.readFn(true)); // 1n
  const errVal = await t.rovErr(contract.readFn(false)); // 0n

  // calling public fns in read-only mode
  await t.rovOk(contract.publicFn()); // true

  // map getters
  await t.mapGet(contract.myMap(1n)); // bigint | null

  // arbitrary code
  const evalReceipt = await t.evalCode<bigint>('(+ u1 u2)');
  console.log(evalReceipt.value, evalReceipt.costs, evalReceipt.logs);
  // helper to eval and get return value
  await t.eval<bigint>('(+ u1 u2)'); // 3n
  // eval in a contract context
  await t.eval('(public-fn)', contractAddr); // Response<boolean>
  ```

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

* Updated dependencies [[`529cff2`](https://github.com/obylabs/clarigen/commit/529cff2a42263ff801f4a20d62bf7adfbd92ee0a), [`d72e4e4`](https://github.com/obylabs/clarigen/commit/d72e4e4e160311d4ed39cf36f105ec9f0df92c81)]:
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

- [`d5d9dc6`](https://github.com/obylabs/clarigen/commit/d5d9dc6b039bfb7c5e39d294594b753bb924b435) Thanks [@hstove](https://github.com/hstove)! - Fixed the return type for the test util contract's methods (from number to bigint)

- Updated dependencies [[`d5d9dc6`](https://github.com/obylabs/clarigen/commit/d5d9dc6b039bfb7c5e39d294594b753bb924b435)]:
  - @clarigen/native-bin@0.2.7

## 0.2.6

### Patch Changes

- [`4b23df1`](https://github.com/obylabs/clarigen/commit/4b23df1390d0f9759eff5b3bab0a4b3ea3a707c2) Thanks [@hstove](https://github.com/hstove)! - Added the `test-utils.clar` contract to NPM files

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
