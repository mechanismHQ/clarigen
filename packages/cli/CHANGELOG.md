# @clarigen/cli

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
