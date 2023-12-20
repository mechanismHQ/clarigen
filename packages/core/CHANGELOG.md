# @clarigen/core

## 1.0.16-alpha.5

### Patch Changes

- [#37](https://github.com/mechanismHQ/clarigen/pull/37) [`ac1ef2f`](https://github.com/mechanismHQ/clarigen/commit/ac1ef2ffa39dcb580693694b6c98d15194f07910) Thanks [@hstove](https://github.com/hstove)! - Fixes `toCamelCase` to handle UPPER_CASE format

## 1.0.16-alpha.4

### Patch Changes

- [`b969418`](https://github.com/mechanismHQ/clarigen/commit/b9694186e7b9a07368d75b46a66dcfdb1f9357d7) Thanks [@hstove](https://github.com/hstove)! - Improves types in `test` package

## 1.0.16-alpha.3

### Patch Changes

- [`911cc06`](https://github.com/mechanismHQ/clarigen/commit/911cc06c8f293d53c29e2cd5e16eff38a7762053) Thanks [@hstove](https://github.com/hstove)! - Include missing built files

## 1.0.16-alpha.2

### Patch Changes

- [`9a863ad`](https://github.com/mechanismHQ/clarigen/commit/9a863adcb5c94582e369181f2a8773078416f4f4) Thanks [@hstove](https://github.com/hstove)! - Export utils from `test`

## 1.0.16-alpha.1

### Patch Changes

- [`1e52fd6`](https://github.com/mechanismHQ/clarigen/commit/1e52fd6b8278feec80961dcdd1f34ddf393a132f) Thanks [@hstove](https://github.com/hstove)! - Adds raw clarity parsing capabilities to `core` and more helper functions to `test`

## 1.0.16-alpha.0

## 1.0.15

### Patch Changes

- [`bdcaa6b`](https://github.com/mechanismHQ/clarigen/commit/bdcaa6b20bac7bfa645da33b123f1ec266bfa80a) Thanks [@hstove](https://github.com/hstove)! - - Fixed an issue with generically typed `projectFactory`, where contracts without mainnet deployments were typed as 'undefined'.
  - Exports `UnknownArg` and `UnknownArgs`;
  - Fixed an issue with `parseToCV` where an `(optional uint)` would return `none` when given a zero value (ie `0` or `0n`).

## 1.0.14

### Patch Changes

- [`c74ca1e`](https://github.com/mechanismHQ/clarigen/commit/c74ca1ee50892a946b74c30161cc6f50d6fe4375) Thanks [@hstove](https://github.com/hstove)! - Automatically infer post condition type from raw ABI

## 1.0.13

### Patch Changes

- [`b4d0e58`](https://github.com/mechanismHQ/clarigen/commit/b4d0e58255efa5d0b4768417165b5b6ad7aee76d) Thanks [@hstove](https://github.com/hstove)! - Adds helper methods for creating post conditions for a contract.

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

* [`585c13c`](https://github.com/mechanismHQ/clarigen/commit/585c13c20cdf10185d7f3dcaa335aa9e3cc5eef7) Thanks [@hstove](https://github.com/hstove)! - Updates the `ClarigenClient` constructor type to only rely on a `Network` with `getCoreApiUrl`. This will improve compatibility with Stacks.js

## 1.0.12

### Patch Changes

- [`45cd949`](https://github.com/mechanismHQ/clarigen/commit/45cd9496d9c3c37cbc43a21bfe5a42d7dc76b1e3) Thanks [@hstove](https://github.com/hstove)! - Feat: `@clarigen/core` exposes simple read-only client

## 1.0.11

### Patch Changes

- [`90da077`](https://github.com/mechanismHQ/clarigen/commit/90da077d69e575ba4502fe1e8e075823c758f295) Thanks [@hstove](https://github.com/hstove)! - Updates all `@clarigen/core` read-only api functions to support usage with only `url` instead of needing a `StacksNetwork`

## 1.0.10

### Patch Changes

- [`3567c41`](https://github.com/mechanismHQ/clarigen/commit/3567c4162a3b5e990e93051d9316c2582012111f) Thanks [@hstove](https://github.com/hstove)! - Fixes mechanism for generating payload to `map_entry` api

## 1.0.9

### Patch Changes

- [`a7f4bc5`](https://github.com/mechanismHQ/clarigen/commit/a7f4bc5b468dd9da73fc9e3094583bc1aba0b107) Thanks [@hstove](https://github.com/hstove)! - Fixes serialization during map entry lookup

## 1.0.8

### Patch Changes

- [`ec4482c`](https://github.com/mechanismHQ/clarigen/commit/ec4482c7fb83d4ccbb69b08e222b560ab5b900e4) Thanks [@hstove](https://github.com/hstove)! - Adds a helper for fetching typed map entries

## 1.0.7

### Patch Changes

- [`e94e6e7`](https://github.com/mechanismHQ/clarigen/commit/e94e6e7d67d3a20272e0fce12e8ba63f68bbc039) Thanks [@hstove](https://github.com/hstove)! - Fixed an issue with `Jsonize` type relating to arrays

## 1.0.6

### Patch Changes

- [`ed62d09`](https://github.com/mechanismHQ/clarigen/commit/ed62d098f45faead79521493a36c0b13723c5fc4) Thanks [@hstove](https://github.com/hstove)! - Fixes types when calling read-only functions with the `json` option

## 1.0.5

### Patch Changes

- [`6936994`](https://github.com/mechanismHQ/clarigen/commit/6936994f866baa852ce5add15db60f8e57b70ea6) Thanks [@hstove](https://github.com/hstove)! - Updated all read-only API functions to support a `json` option property. If provided and set as `true`, the values returned will be JSON compatible.

## 1.0.4

### Patch Changes

- [`77b53f9`](https://github.com/mechanismHQ/clarigen/commit/77b53f96de3b784868a8f899e343f183ebd7f628) Thanks [@hstove](https://github.com/hstove)! - Fixes a bug with `cvToJSON`

## 1.0.3

### Patch Changes

- [`3e32f24`](https://github.com/mechanismHQ/clarigen/commit/3e32f2409df85c5adb6d2bf784f9ed7cb6ffaf2b) Thanks [@hstove](https://github.com/hstove)! - Added `cvToJSON` in "@clarigen/core"

## 1.0.2

### Patch Changes

- [`5d11043`](https://github.com/mechanismHQ/clarigen/commit/5d110431363ba3a41460a7eb63ea503ef4306120) Thanks [@hstove](https://github.com/hstove)! - Fixed an issue of not correctly passing network through ClarigenClient

## 1.0.1

### Patch Changes

- [`0a97048`](https://github.com/mechanismHQ/clarigen/commit/0a97048f6f562f9c0e2b82419dd9e74f2622ba0b) Thanks [@hstove](https://github.com/hstove)! - Updated the `ContractCall` type to include `functionName`, which allows for spread in micro-stacks functions

## 1.0.0

### Major Changes

- [#28](https://github.com/mechanismHQ/clarigen/pull/28) [`2480675`](https://github.com/mechanismHQ/clarigen/commit/2480675c36da569870e36feba714cc22d849654a) Thanks [@hstove](https://github.com/hstove)! - Migrates all packages to depend on `micro-stacks`. This allows for simplicity and much reduced bundle sizes.

  Most APIs do not change at all, however, there are some breaking changes:

  - The `buff` Clarity type now uses the `Uint8Array` native JS type, instead of `Buffer`
  - Some TypeScript types that came from `@stacks/transactions` will break, like the `PostCondition` type

* [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`f153dc4`](https://github.com/mechanismHQ/clarigen/commit/f153dc4aecc8d65a01933dbe65dd90f85d884756) Thanks [@hstove](https://github.com/hstove)! - Updates the core types built by Clarigen to a more flexible approach. Previously, types were built such the API for returning info from a contract function was supposed to be identical. Here's what types used to look like:

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

### Minor Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`b2f0d85`](https://github.com/mechanismHQ/clarigen/commit/b2f0d85e7385e83f6e3649b0b8bb2ff6005bd429) Thanks [@hstove](https://github.com/hstove)! - Updated all packages to better work with the new type exports

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`b28428e`](https://github.com/mechanismHQ/clarigen/commit/b28428ea807a503ef3eb4420e95e375de4573ddf) Thanks [@hstove](https://github.com/hstove)! - Adds `tip=latest` to read-only calls for node and web

* [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`6916cb8`](https://github.com/mechanismHQ/clarigen/commit/6916cb8ea69715634399a4a48680323257c35719) Thanks [@hstove](https://github.com/hstove)! - Compile deno-compatible types for core package

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`3ee7d9a`](https://github.com/mechanismHQ/clarigen/commit/3ee7d9a28eabfaced6ee073b42f9c48910819e7d) Thanks [@hstove](https://github.com/hstove)! - Exposed some helper types

* [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`15e3f96`](https://github.com/mechanismHQ/clarigen/commit/15e3f96201ddd9f95ce361a0559e3b15df679f59) Thanks [@hstove](https://github.com/hstove)! - Adds a `filterEvents` helper function to `@clarigen/core` to do type-safe event filtering.

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`d415cab`](https://github.com/mechanismHQ/clarigen/commit/d415cabfa80f32eee6adb2027d6073011f5cc53f) Thanks [@hstove](https://github.com/hstove)! - Adds more deployment types for better handling on auto-generated deployments

* [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`a131614`](https://github.com/mechanismHQ/clarigen/commit/a1316142a5bec9e949dd6cacd3328fa2941e12fc) Thanks [@hstove](https://github.com/hstove)! - Updated CLI package to support all config living in `Clarinet.toml`

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`0413049`](https://github.com/mechanismHQ/clarigen/commit/041304944c408b0bdf4e6dcf3cd5c24025f473e0) Thanks [@hstove](https://github.com/hstove)! - Fixed an issue where `contractFactory` didn't have proper `ContractCall` types.

* [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`a585ecb`](https://github.com/mechanismHQ/clarigen/commit/a585ecb3eb44d2a7b6a6850dcc5f01f76ba43b3c) Thanks [@hstove](https://github.com/hstove)! - Moved to a native `Response` type, instead of from `neverthrow`

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`0d9414f`](https://github.com/mechanismHQ/clarigen/commit/0d9414fa8e09df10548a5000a37ac66f60f509fc) Thanks [@hstove](https://github.com/hstove)! - Moved internal package management from yarn to pnpm.

* [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`741c968`](https://github.com/mechanismHQ/clarigen/commit/741c9687ef5e11a26c80f02233905136403ac940) Thanks [@hstove](https://github.com/hstove)! - Fixed an issue where deploying contracts in the test adapter didn't use the contracts specified name. Instead, it inferred the contract name from the contract file.

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`ab39cc9`](https://github.com/mechanismHQ/clarigen/commit/ab39cc98dc1fca1b7c6f11e5e39b44df87f2b0f2) Thanks [@hstove](https://github.com/hstove)! - Fixed an issue where some projects didn't run the correct build script in `prepublishonly`

* [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`1727e49`](https://github.com/mechanismHQ/clarigen/commit/1727e49ba456130115c310527c93c562a07f1716) Thanks [@hstove](https://github.com/hstove)! - Bumps `micro-stacks` version

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`735a83b`](https://github.com/mechanismHQ/clarigen/commit/735a83b6632362a55f4849b23d6fb7a482a316ae) Thanks [@hstove](https://github.com/hstove)! - Manually constructs read-only fn call to include `tip` param.

* [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`b4ee542`](https://github.com/mechanismHQ/clarigen/commit/b4ee5428e1e5f7606824648bba5c9d389a05d2e3) Thanks [@hstove](https://github.com/hstove)! - Fixed handling of tuples with kebab-keys

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`2e62568`](https://github.com/mechanismHQ/clarigen/commit/2e6256853efab622c3d61039c1d55073cb72ff17) Thanks [@hstove](https://github.com/hstove)! - Updates internal build processes with tsup and turborepo

* [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`514ca19`](https://github.com/mechanismHQ/clarigen/commit/514ca1949f4c9905a67f4462dd3a189baad393dc) Thanks [@hstove](https://github.com/hstove)! - Fixed an issue with `deploymentFactory` with requirement publish txs

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`512ef53`](https://github.com/mechanismHQ/clarigen/commit/512ef53c5256acb3fdaf7e836e009d7af5571189) Thanks [@hstove](https://github.com/hstove)! - Fixed error logging when broadcasting a stacks tx

* [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`0dfd00d`](https://github.com/mechanismHQ/clarigen/commit/0dfd00d893c1a10317fe49818b0655e428fb210b) Thanks [@hstove](https://github.com/hstove)! - Exports `makeContracts` in core package

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`5a1f20b`](https://github.com/mechanismHQ/clarigen/commit/5a1f20b442ce8d498c2b49abb8dc6680f90fec01) Thanks [@hstove](https://github.com/hstove)! - Slight change to `factory` apis

* [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`b8988e7`](https://github.com/mechanismHQ/clarigen/commit/b8988e7ec734324de005a7b271d0a03b4cec6d37) Thanks [@hstove](https://github.com/hstove)! - Updates the native `Response` type so that generics are properly included in both `Ok` and `Err` type.

  Also fixed a bug when generating the new output, where long arrays were improperly serialized.

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`0b786bc`](https://github.com/mechanismHQ/clarigen/commit/0b786bc0ebcff900514d555c86f73677f5360f6c) Thanks [@hstove](https://github.com/hstove)! - The CLI now uses `clarinet run` to get session info, which is much more consistent and handles requirements better. Factory and deployment code updated to handle this

* [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`8ae1862`](https://github.com/mechanismHQ/clarigen/commit/8ae18623f3535550c1707642dbde9ec79ae87585) Thanks [@hstove](https://github.com/hstove)! - Created a new generated file type through `@clarigen/cli`. New types allow Clarigen to only need a "typed ABI" in order to generate all of the same functionality. This greatly improve simplicity and portability. This new generated file has zero dependencies, meaning it can be used in Deno.

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`befda6b`](https://github.com/mechanismHQ/clarigen/commit/befda6bd4d3c480527ad75d2e1c873f5934c5979) Thanks [@hstove](https://github.com/hstove)! - Moves to a native `Response` type, instead of using the 'neverthrow' library.

* [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`06ac766`](https://github.com/mechanismHQ/clarigen/commit/06ac7660898a481131082c83172afc3c2a8b80f9) Thanks [@hstove](https://github.com/hstove)! - Fix version bumps

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`3005b7f`](https://github.com/mechanismHQ/clarigen/commit/3005b7ff8c84089ae969dbcb3620aa48de35c7f8) Thanks [@hstove](https://github.com/hstove)! - - Updated micro-stacks dependencies to latest (1.1.4)
  - Added `ClarigenClient` wrapper to web package. Uses MicroStacksClient under the hood
  - Use `micro-stacks/api` function for read-only calls

* [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`d116788`](https://github.com/mechanismHQ/clarigen/commit/d116788fd5f8cfa4a14716c2c7c54f435cb01884) Thanks [@hstove](https://github.com/hstove)! - Adds parsing and saving of deployment plans in typescript form.

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`f1cc407`](https://github.com/mechanismHQ/clarigen/commit/f1cc407fe3430e79468d38b5acdb60cf051ea5c5) Thanks [@hstove](https://github.com/hstove)! - Adds an index-level docs page when generating docs

* [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`7b5ce6d`](https://github.com/mechanismHQ/clarigen/commit/7b5ce6db6460a313924a976e1cfaca3fdbb4dc49) Thanks [@hstove](https://github.com/hstove)! - Adds `mapGet` to node and web adapters, to support getting a map entry for a specific key.

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`1a94545`](https://github.com/mechanismHQ/clarigen/commit/1a94545e482d42cc842e241d5484c69bb9188e7c) Thanks [@hstove](https://github.com/hstove)! - Fixed a bug where the CLI exported invalid types for Response

## 1.0.0-next.32

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`512ef53`](https://github.com/mechanismHQ/clarigen/commit/512ef53c5256acb3fdaf7e836e009d7af5571189) Thanks [@hstove](https://github.com/hstove)! - Fixed error logging when broadcasting a stacks tx

## 1.0.0-next.31

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`3ee7d9a`](https://github.com/mechanismHQ/clarigen/commit/3ee7d9a28eabfaced6ee073b42f9c48910819e7d) Thanks [@hstove](https://github.com/hstove)! - Exposed some helper types

## 1.0.0-next.30

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`b4ee542`](https://github.com/mechanismHQ/clarigen/commit/b4ee5428e1e5f7606824648bba5c9d389a05d2e3) Thanks [@hstove](https://github.com/hstove)! - Fixed handling of tuples with kebab-keys

## 1.0.0-next.29

### Minor Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`b2f0d85`](https://github.com/mechanismHQ/clarigen/commit/b2f0d85e7385e83f6e3649b0b8bb2ff6005bd429) Thanks [@hstove](https://github.com/hstove)! - Updated all packages to better work with the new type exports

## 1.0.0-next.28

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`5a1f20b`](https://github.com/mechanismHQ/clarigen/commit/5a1f20b442ce8d498c2b49abb8dc6680f90fec01) Thanks [@hstove](https://github.com/hstove)! - Slight change to `factory` apis

## 1.0.0-next.27

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`514ca19`](https://github.com/mechanismHQ/clarigen/commit/514ca1949f4c9905a67f4462dd3a189baad393dc) Thanks [@hstove](https://github.com/hstove)! - Fixed an issue with `deploymentFactory` with requirement publish txs

## 1.0.0-next.26

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`d415cab`](https://github.com/mechanismHQ/clarigen/commit/d415cabfa80f32eee6adb2027d6073011f5cc53f) Thanks [@hstove](https://github.com/hstove)! - Adds more deployment types for better handling on auto-generated deployments

## 1.0.0-next.25

### Patch Changes

- The CLI now uses `clarinet run` to get session info, which is much more consistent and handles requirements better. Factory and deployment code updated to handle this

## 1.0.0-next.24

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`06ac766`](https://github.com/mechanismHQ/clarigen/commit/06ac7660898a481131082c83172afc3c2a8b80f9) Thanks [@hstove](https://github.com/hstove)! - Fix version bumps

## 1.0.0-next.23

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`0413049`](https://github.com/mechanismHQ/clarigen/commit/041304944c408b0bdf4e6dcf3cd5c24025f473e0) Thanks [@hstove](https://github.com/hstove)! - Fixed an issue where `contractFactory` didn't have proper `ContractCall` types.

## 1.0.0-next.22

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`d116788`](https://github.com/mechanismHQ/clarigen/commit/d116788fd5f8cfa4a14716c2c7c54f435cb01884) Thanks [@hstove](https://github.com/hstove)! - Adds parsing and saving of deployment plans in typescript form.

## 1.0.0-next.21

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`a131614`](https://github.com/mechanismHQ/clarigen/commit/a1316142a5bec9e949dd6cacd3328fa2941e12fc) Thanks [@hstove](https://github.com/hstove)! - Updated CLI package to support all config living in `Clarinet.toml`

* [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`0d9414f`](https://github.com/mechanismHQ/clarigen/commit/0d9414fa8e09df10548a5000a37ac66f60f509fc) Thanks [@hstove](https://github.com/hstove)! - Moved internal package management from yarn to pnpm.

## 1.0.0-next.19

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`b8988e7`](https://github.com/mechanismHQ/clarigen/commit/b8988e7ec734324de005a7b271d0a03b4cec6d37) Thanks [@hstove](https://github.com/hstove)! - Updates the native `Response` type so that generics are properly included in both `Ok` and `Err` type.

  Also fixed a bug when generating the new output, where long arrays were improperly serialized.

## 1.0.0-next.18

### Patch Changes

- [`8ae1862`](https://github.com/mechanismHQ/clarigen/commit/8ae18623f3535550c1707642dbde9ec79ae87585) Thanks [@hstove](https://github.com/hstove)! - Created a new generated file type through `@clarigen/cli`. New types allow Clarigen to only need a "typed ABI" in order to generate all of the same functionality. This greatly improve simplicity and portability. This new generated file has zero dependencies, meaning it can be used in Deno.

## 1.0.0-next.17

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`1a94545`](https://github.com/mechanismHQ/clarigen/commit/1a94545e482d42cc842e241d5484c69bb9188e7c) Thanks [@hstove](https://github.com/hstove)! - Fixed a bug where the CLI exported invalid types for Response

## 1.0.0-next.16

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`f1cc407`](https://github.com/mechanismHQ/clarigen/commit/f1cc407fe3430e79468d38b5acdb60cf051ea5c5) Thanks [@hstove](https://github.com/hstove)! - Adds an index-level docs page when generating docs

## 1.0.0-next.15

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`6916cb8`](https://github.com/mechanismHQ/clarigen/commit/6916cb8ea69715634399a4a48680323257c35719) Thanks [@hstove](https://github.com/hstove)! - Compile deno-compatible types for core package

## 1.0.0-next.14

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`a585ecb`](https://github.com/mechanismHQ/clarigen/commit/a585ecb3eb44d2a7b6a6850dcc5f01f76ba43b3c) Thanks [@hstove](https://github.com/hstove)! - Moved to a native `Response` type, instead of from `neverthrow`

* Moves to a native `Response` type, instead of using the 'neverthrow' library.

## 1.0.0-next.11

### Patch Changes

- Fixed an issue where some projects didn't run the correct build script in `prepublishonly`

## 1.0.0-next.10

### Patch Changes

- [`2e62568`](https://github.com/mechanismHQ/clarigen/commit/2e6256853efab622c3d61039c1d55073cb72ff17) Thanks [@hstove](https://github.com/hstove)! - Updates internal build processes with tsup and turborepo

## 1.0.0-next.9

### Patch Changes

- Adds a `filterEvents` helper function to `@clarigen/core` to do type-safe event filtering.

## 1.0.0-next.8

### Patch Changes

- [`741c968`](https://github.com/mechanismHQ/clarigen/commit/741c9687ef5e11a26c80f02233905136403ac940) Thanks [@hstove](https://github.com/hstove)! - Fixed an issue where deploying contracts in the test adapter didn't use the contracts specified name. Instead, it inferred the contract name from the contract file.

* [`7b5ce6d`](https://github.com/mechanismHQ/clarigen/commit/7b5ce6db6460a313924a976e1cfaca3fdbb4dc49) Thanks [@hstove](https://github.com/hstove)! - Adds `mapGet` to node and web adapters, to support getting a map entry for a specific key.

## 1.0.0-next.7

### Patch Changes

- Manually constructs read-only fn call to include `tip` param.

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
