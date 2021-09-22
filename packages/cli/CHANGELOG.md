# @clarigen/cli

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
