# @clarigen/web

## 1.0.16-alpha.0

### Patch Changes

- Updated dependencies []:
  - @clarigen/core@1.0.16-alpha.0

## 1.0.15

### Patch Changes

- Updated dependencies [[`bdcaa6b`](https://github.com/mechanismHQ/clarigen/commit/bdcaa6b20bac7bfa645da33b123f1ec266bfa80a)]:
  - @clarigen/core@1.0.15

## 1.0.14

### Patch Changes

- Updated dependencies [[`c74ca1e`](https://github.com/mechanismHQ/clarigen/commit/c74ca1ee50892a946b74c30161cc6f50d6fe4375)]:
  - @clarigen/core@1.0.14

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

* Updated dependencies [[`b4d0e58`](https://github.com/mechanismHQ/clarigen/commit/b4d0e58255efa5d0b4768417165b5b6ad7aee76d), [`585c13c`](https://github.com/mechanismHQ/clarigen/commit/585c13c20cdf10185d7f3dcaa335aa9e3cc5eef7)]:
  - @clarigen/core@1.0.13

## 1.0.12

### Patch Changes

- [`45cd949`](https://github.com/mechanismHQ/clarigen/commit/45cd9496d9c3c37cbc43a21bfe5a42d7dc76b1e3) Thanks [@hstove](https://github.com/hstove)! - Feat: `@clarigen/core` exposes simple read-only client

- Updated dependencies [[`45cd949`](https://github.com/mechanismHQ/clarigen/commit/45cd9496d9c3c37cbc43a21bfe5a42d7dc76b1e3)]:
  - @clarigen/core@1.0.12

## 1.0.11

### Patch Changes

- [`90da077`](https://github.com/mechanismHQ/clarigen/commit/90da077d69e575ba4502fe1e8e075823c758f295) Thanks [@hstove](https://github.com/hstove)! - Updates all `@clarigen/core` read-only api functions to support usage with only `url` instead of needing a `StacksNetwork`

- Updated dependencies [[`90da077`](https://github.com/mechanismHQ/clarigen/commit/90da077d69e575ba4502fe1e8e075823c758f295)]:
  - @clarigen/core@1.0.11

## 1.0.10

### Patch Changes

- [`3567c41`](https://github.com/mechanismHQ/clarigen/commit/3567c4162a3b5e990e93051d9316c2582012111f) Thanks [@hstove](https://github.com/hstove)! - Fixes mechanism for generating payload to `map_entry` api

- Updated dependencies [[`3567c41`](https://github.com/mechanismHQ/clarigen/commit/3567c4162a3b5e990e93051d9316c2582012111f)]:
  - @clarigen/core@1.0.10

## 1.0.9

### Patch Changes

- [`a7f4bc5`](https://github.com/mechanismHQ/clarigen/commit/a7f4bc5b468dd9da73fc9e3094583bc1aba0b107) Thanks [@hstove](https://github.com/hstove)! - Fixes serialization during map entry lookup

- Updated dependencies [[`a7f4bc5`](https://github.com/mechanismHQ/clarigen/commit/a7f4bc5b468dd9da73fc9e3094583bc1aba0b107)]:
  - @clarigen/core@1.0.9

## 1.0.8

### Patch Changes

- [`ec4482c`](https://github.com/mechanismHQ/clarigen/commit/ec4482c7fb83d4ccbb69b08e222b560ab5b900e4) Thanks [@hstove](https://github.com/hstove)! - Adds a helper for fetching typed map entries

- Updated dependencies [[`ec4482c`](https://github.com/mechanismHQ/clarigen/commit/ec4482c7fb83d4ccbb69b08e222b560ab5b900e4)]:
  - @clarigen/core@1.0.8

## 1.0.7

### Patch Changes

- [`e94e6e7`](https://github.com/mechanismHQ/clarigen/commit/e94e6e7d67d3a20272e0fce12e8ba63f68bbc039) Thanks [@hstove](https://github.com/hstove)! - Fixed an issue with `Jsonize` type relating to arrays

- Updated dependencies [[`e94e6e7`](https://github.com/mechanismHQ/clarigen/commit/e94e6e7d67d3a20272e0fce12e8ba63f68bbc039)]:
  - @clarigen/core@1.0.7

## 1.0.6

### Patch Changes

- [`ed62d09`](https://github.com/mechanismHQ/clarigen/commit/ed62d098f45faead79521493a36c0b13723c5fc4) Thanks [@hstove](https://github.com/hstove)! - Fixes types when calling read-only functions with the `json` option

- Updated dependencies [[`ed62d09`](https://github.com/mechanismHQ/clarigen/commit/ed62d098f45faead79521493a36c0b13723c5fc4)]:
  - @clarigen/core@1.0.6

## 1.0.5

### Patch Changes

- [`6936994`](https://github.com/mechanismHQ/clarigen/commit/6936994f866baa852ce5add15db60f8e57b70ea6) Thanks [@hstove](https://github.com/hstove)! - Updated all read-only API functions to support a `json` option property. If provided and set as `true`, the values returned will be JSON compatible.

- Updated dependencies [[`6936994`](https://github.com/mechanismHQ/clarigen/commit/6936994f866baa852ce5add15db60f8e57b70ea6)]:
  - @clarigen/core@1.0.5

## 1.0.4

### Patch Changes

- [`77b53f9`](https://github.com/mechanismHQ/clarigen/commit/77b53f96de3b784868a8f899e343f183ebd7f628) Thanks [@hstove](https://github.com/hstove)! - Fixes a bug with `cvToJSON`

- Updated dependencies [[`77b53f9`](https://github.com/mechanismHQ/clarigen/commit/77b53f96de3b784868a8f899e343f183ebd7f628)]:
  - @clarigen/core@1.0.4

## 1.0.3

### Patch Changes

- [`3e32f24`](https://github.com/mechanismHQ/clarigen/commit/3e32f2409df85c5adb6d2bf784f9ed7cb6ffaf2b) Thanks [@hstove](https://github.com/hstove)! - Added `cvToJSON` in "@clarigen/core"

- Updated dependencies [[`3e32f24`](https://github.com/mechanismHQ/clarigen/commit/3e32f2409df85c5adb6d2bf784f9ed7cb6ffaf2b)]:
  - @clarigen/core@1.0.3

## 1.0.2

### Patch Changes

- [`5d11043`](https://github.com/mechanismHQ/clarigen/commit/5d110431363ba3a41460a7eb63ea503ef4306120) Thanks [@hstove](https://github.com/hstove)! - Fixed an issue of not correctly passing network through ClarigenClient

- Updated dependencies [[`5d11043`](https://github.com/mechanismHQ/clarigen/commit/5d110431363ba3a41460a7eb63ea503ef4306120)]:
  - @clarigen/core@1.0.2

## 1.0.1

### Patch Changes

- Updated dependencies [[`0a97048`](https://github.com/mechanismHQ/clarigen/commit/0a97048f6f562f9c0e2b82419dd9e74f2622ba0b)]:
  - @clarigen/core@1.0.1

## 1.0.0

### Major Changes

- [#28](https://github.com/mechanismHQ/clarigen/pull/28) [`2480675`](https://github.com/mechanismHQ/clarigen/commit/2480675c36da569870e36feba714cc22d849654a) Thanks [@hstove](https://github.com/hstove)! - Migrates all packages to depend on `micro-stacks`. This allows for simplicity and much reduced bundle sizes.

  Most APIs do not change at all, however, there are some breaking changes:

  - The `buff` Clarity type now uses the `Uint8Array` native JS type, instead of `Buffer`
  - Some TypeScript types that came from `@stacks/transactions` will break, like the `PostCondition` type

### Minor Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`b2f0d85`](https://github.com/mechanismHQ/clarigen/commit/b2f0d85e7385e83f6e3649b0b8bb2ff6005bd429) Thanks [@hstove](https://github.com/hstove)! - Updated all packages to better work with the new type exports

* [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`a5785de`](https://github.com/mechanismHQ/clarigen/commit/a5785debb2db928f209f8d119f96955af42dfdc9) Thanks [@hstove](https://github.com/hstove)! - Updated to use the new v1 Clarigen types

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`b28428e`](https://github.com/mechanismHQ/clarigen/commit/b28428ea807a503ef3eb4420e95e375de4573ddf) Thanks [@hstove](https://github.com/hstove)! - Adds `tip=latest` to read-only calls for node and web

* [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`a131614`](https://github.com/mechanismHQ/clarigen/commit/a1316142a5bec9e949dd6cacd3328fa2941e12fc) Thanks [@hstove](https://github.com/hstove)! - Updated CLI package to support all config living in `Clarinet.toml`

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`a585ecb`](https://github.com/mechanismHQ/clarigen/commit/a585ecb3eb44d2a7b6a6850dcc5f01f76ba43b3c) Thanks [@hstove](https://github.com/hstove)! - Moved to a native `Response` type, instead of from `neverthrow`

* [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`0d9414f`](https://github.com/mechanismHQ/clarigen/commit/0d9414fa8e09df10548a5000a37ac66f60f509fc) Thanks [@hstove](https://github.com/hstove)! - Moved internal package management from yarn to pnpm.

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`ab39cc9`](https://github.com/mechanismHQ/clarigen/commit/ab39cc98dc1fca1b7c6f11e5e39b44df87f2b0f2) Thanks [@hstove](https://github.com/hstove)! - Fixed an issue where some projects didn't run the correct build script in `prepublishonly`

* [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`1727e49`](https://github.com/mechanismHQ/clarigen/commit/1727e49ba456130115c310527c93c562a07f1716) Thanks [@hstove](https://github.com/hstove)! - Bumps `micro-stacks` version

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`735a83b`](https://github.com/mechanismHQ/clarigen/commit/735a83b6632362a55f4849b23d6fb7a482a316ae) Thanks [@hstove](https://github.com/hstove)! - Manually constructs read-only fn call to include `tip` param.

* [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`b4ee542`](https://github.com/mechanismHQ/clarigen/commit/b4ee5428e1e5f7606824648bba5c9d389a05d2e3) Thanks [@hstove](https://github.com/hstove)! - Fixed handling of tuples with kebab-keys

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`2e62568`](https://github.com/mechanismHQ/clarigen/commit/2e6256853efab622c3d61039c1d55073cb72ff17) Thanks [@hstove](https://github.com/hstove)! - Updates internal build processes with tsup and turborepo

* [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`512ef53`](https://github.com/mechanismHQ/clarigen/commit/512ef53c5256acb3fdaf7e836e009d7af5571189) Thanks [@hstove](https://github.com/hstove)! - Fixed error logging when broadcasting a stacks tx

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

- Updated dependencies [[`b28428e`](https://github.com/mechanismHQ/clarigen/commit/b28428ea807a503ef3eb4420e95e375de4573ddf), [`6916cb8`](https://github.com/mechanismHQ/clarigen/commit/6916cb8ea69715634399a4a48680323257c35719), [`3ee7d9a`](https://github.com/mechanismHQ/clarigen/commit/3ee7d9a28eabfaced6ee073b42f9c48910819e7d), [`2480675`](https://github.com/mechanismHQ/clarigen/commit/2480675c36da569870e36feba714cc22d849654a), [`15e3f96`](https://github.com/mechanismHQ/clarigen/commit/15e3f96201ddd9f95ce361a0559e3b15df679f59), [`d415cab`](https://github.com/mechanismHQ/clarigen/commit/d415cabfa80f32eee6adb2027d6073011f5cc53f), [`a131614`](https://github.com/mechanismHQ/clarigen/commit/a1316142a5bec9e949dd6cacd3328fa2941e12fc), [`0413049`](https://github.com/mechanismHQ/clarigen/commit/041304944c408b0bdf4e6dcf3cd5c24025f473e0), [`a585ecb`](https://github.com/mechanismHQ/clarigen/commit/a585ecb3eb44d2a7b6a6850dcc5f01f76ba43b3c), [`0d9414f`](https://github.com/mechanismHQ/clarigen/commit/0d9414fa8e09df10548a5000a37ac66f60f509fc), [`741c968`](https://github.com/mechanismHQ/clarigen/commit/741c9687ef5e11a26c80f02233905136403ac940), [`ab39cc9`](https://github.com/mechanismHQ/clarigen/commit/ab39cc98dc1fca1b7c6f11e5e39b44df87f2b0f2), [`1727e49`](https://github.com/mechanismHQ/clarigen/commit/1727e49ba456130115c310527c93c562a07f1716), [`735a83b`](https://github.com/mechanismHQ/clarigen/commit/735a83b6632362a55f4849b23d6fb7a482a316ae), [`b4ee542`](https://github.com/mechanismHQ/clarigen/commit/b4ee5428e1e5f7606824648bba5c9d389a05d2e3), [`2e62568`](https://github.com/mechanismHQ/clarigen/commit/2e6256853efab622c3d61039c1d55073cb72ff17), [`514ca19`](https://github.com/mechanismHQ/clarigen/commit/514ca1949f4c9905a67f4462dd3a189baad393dc), [`512ef53`](https://github.com/mechanismHQ/clarigen/commit/512ef53c5256acb3fdaf7e836e009d7af5571189), [`b2f0d85`](https://github.com/mechanismHQ/clarigen/commit/b2f0d85e7385e83f6e3649b0b8bb2ff6005bd429), [`0dfd00d`](https://github.com/mechanismHQ/clarigen/commit/0dfd00d893c1a10317fe49818b0655e428fb210b), [`5a1f20b`](https://github.com/mechanismHQ/clarigen/commit/5a1f20b442ce8d498c2b49abb8dc6680f90fec01), [`b8988e7`](https://github.com/mechanismHQ/clarigen/commit/b8988e7ec734324de005a7b271d0a03b4cec6d37), [`0b786bc`](https://github.com/mechanismHQ/clarigen/commit/0b786bc0ebcff900514d555c86f73677f5360f6c), [`8ae1862`](https://github.com/mechanismHQ/clarigen/commit/8ae18623f3535550c1707642dbde9ec79ae87585), [`befda6b`](https://github.com/mechanismHQ/clarigen/commit/befda6bd4d3c480527ad75d2e1c873f5934c5979), [`06ac766`](https://github.com/mechanismHQ/clarigen/commit/06ac7660898a481131082c83172afc3c2a8b80f9), [`3005b7f`](https://github.com/mechanismHQ/clarigen/commit/3005b7ff8c84089ae969dbcb3620aa48de35c7f8), [`d116788`](https://github.com/mechanismHQ/clarigen/commit/d116788fd5f8cfa4a14716c2c7c54f435cb01884), [`f153dc4`](https://github.com/mechanismHQ/clarigen/commit/f153dc4aecc8d65a01933dbe65dd90f85d884756), [`f1cc407`](https://github.com/mechanismHQ/clarigen/commit/f1cc407fe3430e79468d38b5acdb60cf051ea5c5), [`7b5ce6d`](https://github.com/mechanismHQ/clarigen/commit/7b5ce6db6460a313924a976e1cfaca3fdbb4dc49), [`1a94545`](https://github.com/mechanismHQ/clarigen/commit/1a94545e482d42cc842e241d5484c69bb9188e7c)]:
  - @clarigen/core@1.0.0

## 1.0.0-next.32

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`512ef53`](https://github.com/mechanismHQ/clarigen/commit/512ef53c5256acb3fdaf7e836e009d7af5571189) Thanks [@hstove](https://github.com/hstove)! - Fixed error logging when broadcasting a stacks tx

- Updated dependencies [[`512ef53`](https://github.com/mechanismHQ/clarigen/commit/512ef53c5256acb3fdaf7e836e009d7af5571189)]:
  - @clarigen/core@1.0.0-next.32

## 1.0.0-next.27

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`b4ee542`](https://github.com/mechanismHQ/clarigen/commit/b4ee5428e1e5f7606824648bba5c9d389a05d2e3) Thanks [@hstove](https://github.com/hstove)! - Fixed handling of tuples with kebab-keys

- Updated dependencies [[`b4ee542`](https://github.com/mechanismHQ/clarigen/commit/b4ee5428e1e5f7606824648bba5c9d389a05d2e3)]:
  - @clarigen/core@1.0.0-next.30

## 1.0.0-next.26

### Minor Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`b2f0d85`](https://github.com/mechanismHQ/clarigen/commit/b2f0d85e7385e83f6e3649b0b8bb2ff6005bd429) Thanks [@hstove](https://github.com/hstove)! - Updated all packages to better work with the new type exports

### Patch Changes

- Updated dependencies [[`b2f0d85`](https://github.com/mechanismHQ/clarigen/commit/b2f0d85e7385e83f6e3649b0b8bb2ff6005bd429)]:
  - @clarigen/core@1.0.0-next.29

## 1.0.0-next.25

### Patch Changes

- The CLI now uses `clarinet run` to get session info, which is much more consistent and handles requirements better. Factory and deployment code updated to handle this

- Updated dependencies []:
  - @clarigen/core@1.0.0-next.25

## 1.0.0-next.24

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`06ac766`](https://github.com/mechanismHQ/clarigen/commit/06ac7660898a481131082c83172afc3c2a8b80f9) Thanks [@hstove](https://github.com/hstove)! - Fix version bumps

- Updated dependencies [[`06ac766`](https://github.com/mechanismHQ/clarigen/commit/06ac7660898a481131082c83172afc3c2a8b80f9)]:
  - @clarigen/core@1.0.0-next.24

## 1.0.0-next.22

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`d116788`](https://github.com/mechanismHQ/clarigen/commit/d116788fd5f8cfa4a14716c2c7c54f435cb01884) Thanks [@hstove](https://github.com/hstove)! - Adds parsing and saving of deployment plans in typescript form.

- Updated dependencies [[`d116788`](https://github.com/mechanismHQ/clarigen/commit/d116788fd5f8cfa4a14716c2c7c54f435cb01884)]:
  - @clarigen/core@1.0.0-next.22

## 1.0.0-next.21

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`a131614`](https://github.com/mechanismHQ/clarigen/commit/a1316142a5bec9e949dd6cacd3328fa2941e12fc) Thanks [@hstove](https://github.com/hstove)! - Updated CLI package to support all config living in `Clarinet.toml`

* [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`0d9414f`](https://github.com/mechanismHQ/clarigen/commit/0d9414fa8e09df10548a5000a37ac66f60f509fc) Thanks [@hstove](https://github.com/hstove)! - Moved internal package management from yarn to pnpm.

* Updated dependencies [[`a131614`](https://github.com/mechanismHQ/clarigen/commit/a1316142a5bec9e949dd6cacd3328fa2941e12fc), [`0d9414f`](https://github.com/mechanismHQ/clarigen/commit/0d9414fa8e09df10548a5000a37ac66f60f509fc)]:
  - @clarigen/core@1.0.0-next.21

## 1.0.0-next.19

### Patch Changes

- Updated dependencies [[`b8988e7`](https://github.com/mechanismHQ/clarigen/commit/b8988e7ec734324de005a7b271d0a03b4cec6d37)]:
  - @clarigen/core@1.0.0-next.19

## 1.0.0-next.18

### Patch Changes

- [`8ae1862`](https://github.com/mechanismHQ/clarigen/commit/8ae18623f3535550c1707642dbde9ec79ae87585) Thanks [@hstove](https://github.com/hstove)! - Created a new generated file type through `@clarigen/cli`. New types allow Clarigen to only need a "typed ABI" in order to generate all of the same functionality. This greatly improve simplicity and portability. This new generated file has zero dependencies, meaning it can be used in Deno.

- Updated dependencies [[`8ae1862`](https://github.com/mechanismHQ/clarigen/commit/8ae18623f3535550c1707642dbde9ec79ae87585)]:
  - @clarigen/core@1.0.0-next.18

## 1.0.0-next.17

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`1a94545`](https://github.com/mechanismHQ/clarigen/commit/1a94545e482d42cc842e241d5484c69bb9188e7c) Thanks [@hstove](https://github.com/hstove)! - Fixed a bug where the CLI exported invalid types for Response

- Updated dependencies [[`1a94545`](https://github.com/mechanismHQ/clarigen/commit/1a94545e482d42cc842e241d5484c69bb9188e7c)]:
  - @clarigen/core@1.0.0-next.17

## 1.0.0-next.16

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`f1cc407`](https://github.com/mechanismHQ/clarigen/commit/f1cc407fe3430e79468d38b5acdb60cf051ea5c5) Thanks [@hstove](https://github.com/hstove)! - Adds an index-level docs page when generating docs

- Updated dependencies [[`f1cc407`](https://github.com/mechanismHQ/clarigen/commit/f1cc407fe3430e79468d38b5acdb60cf051ea5c5)]:
  - @clarigen/core@1.0.0-next.16

## 1.0.0-next.15

### Patch Changes

- Updated dependencies [[`6916cb8`](https://github.com/mechanismHQ/clarigen/commit/6916cb8ea69715634399a4a48680323257c35719)]:
  - @clarigen/core@1.0.0-next.15

## 1.0.0-next.14

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`a585ecb`](https://github.com/mechanismHQ/clarigen/commit/a585ecb3eb44d2a7b6a6850dcc5f01f76ba43b3c) Thanks [@hstove](https://github.com/hstove)! - Moved to a native `Response` type, instead of from `neverthrow`

* Moves to a native `Response` type, instead of using the 'neverthrow' library.

* Updated dependencies [[`a585ecb`](https://github.com/mechanismHQ/clarigen/commit/a585ecb3eb44d2a7b6a6850dcc5f01f76ba43b3c)]:
  - @clarigen/core@1.0.0-next.14

## 1.0.0-next.11

### Patch Changes

- Fixed an issue where some projects didn't run the correct build script in `prepublishonly`

- Updated dependencies []:
  - @clarigen/core@1.0.0-next.11

## 1.0.0-next.10

### Patch Changes

- [`2e62568`](https://github.com/mechanismHQ/clarigen/commit/2e6256853efab622c3d61039c1d55073cb72ff17) Thanks [@hstove](https://github.com/hstove)! - Updates internal build processes with tsup and turborepo

- Updated dependencies [[`2e62568`](https://github.com/mechanismHQ/clarigen/commit/2e6256853efab622c3d61039c1d55073cb72ff17)]:
  - @clarigen/core@1.0.0-next.10

## 1.0.0-next.9

### Patch Changes

- Updated dependencies []:
  - @clarigen/core@1.0.0-next.9

## 1.0.0-next.8

### Patch Changes

- [`7b5ce6d`](https://github.com/mechanismHQ/clarigen/commit/7b5ce6db6460a313924a976e1cfaca3fdbb4dc49) Thanks [@hstove](https://github.com/hstove)! - Adds `mapGet` to node and web adapters, to support getting a map entry for a specific key.

- Updated dependencies [[`741c968`](https://github.com/mechanismHQ/clarigen/commit/741c9687ef5e11a26c80f02233905136403ac940), [`7b5ce6d`](https://github.com/mechanismHQ/clarigen/commit/7b5ce6db6460a313924a976e1cfaca3fdbb4dc49)]:
  - @clarigen/core@1.0.0-next.8

## 1.0.0-next.7

### Patch Changes

- Manually constructs read-only fn call to include `tip` param.

- Updated dependencies []:
  - @clarigen/core@1.0.0-next.7

## 1.0.0-next.6

### Patch Changes

- Adds `tip=latest` to read-only calls for node and web

- Updated dependencies []:
  - @clarigen/core@1.0.0-next.6

## 1.0.0-next.4

### Patch Changes

- Updated dependencies []:
  - @clarigen/core@1.0.0-next.4

## 1.0.0-next.3

### Minor Changes

- [`a5785de`](https://github.com/obylabs/clarigen/commit/a5785debb2db928f209f8d119f96955af42dfdc9) Thanks [@hstove](https://github.com/hstove)! - Updated to use the new v1 Clarigen types

### Patch Changes

- [`1727e49`](https://github.com/obylabs/clarigen/commit/1727e49ba456130115c310527c93c562a07f1716) Thanks [@hstove](https://github.com/hstove)! - Bumps `micro-stacks` version

- Updated dependencies [[`1727e49`](https://github.com/obylabs/clarigen/commit/1727e49ba456130115c310527c93c562a07f1716)]:
  - @clarigen/core@1.0.0-next.3

## 1.0.0-next.1

### Patch Changes

- Updated dependencies []:
  - @clarigen/core@1.0.0-next.1

## 1.0.0-next.0

### Major Changes

- [#28](https://github.com/obylabs/clarigen/pull/28) [`574834a`](https://github.com/obylabs/clarigen/commit/574834a950d8b8cfcff620c66f3f22b62c191c51) Thanks [@hstove](https://github.com/hstove)! - Migrates all packages to depend on `micro-stacks`. This allows for simplicity and much reduced bundle sizes.

  Most APIs do not change at all, however, there are some breaking changes:

  - The `buff` Clarity type now uses the `Uint8Array` native JS type, instead of `Buffer`
  - Some TypeScript types that came from `@stacks/transactions` will break, like the `PostCondition` type

### Patch Changes

- Updated dependencies [[`574834a`](https://github.com/obylabs/clarigen/commit/574834a950d8b8cfcff620c66f3f22b62c191c51)]:
  - @clarigen/core@1.0.0-next.0

## 0.3.5

### Patch Changes

- [`d31ea8a`](https://github.com/obylabs/clarigen/commit/d31ea8a3438454a2cffde6528cf8d42b3909b82a) Thanks [@hstove](https://github.com/hstove)! - Allow setting `deployerAddress` on WebProvider

## 0.3.4

### Patch Changes

- [`3f04d0d`](https://github.com/obylabs/clarigen/commit/3f04d0d5cf0e5e23e52ac2c6d598b08f6c0d58d1) Thanks [@hstove](https://github.com/hstove)! - Adds support for the `sponsored` flag when signing a transaction

- Updated dependencies [[`3f04d0d`](https://github.com/obylabs/clarigen/commit/3f04d0d5cf0e5e23e52ac2c6d598b08f6c0d58d1)]:
  - @clarigen/core@0.3.4

## 0.3.3

### Patch Changes

- [`7278ff6`](https://github.com/obylabs/clarigen/commit/7278ff662c98a6723e9f26579684dd36f35cdeea) Thanks [@hstove](https://github.com/hstove)! - Fixes a bug where WebProvider read-only calls wouldn't work in a node.js context.

## 0.3.2

### Patch Changes

- Updated dependencies [[`529cff2`](https://github.com/obylabs/clarigen/commit/529cff2a42263ff801f4a20d62bf7adfbd92ee0a), [`d72e4e4`](https://github.com/obylabs/clarigen/commit/d72e4e4e160311d4ed39cf36f105ec9f0df92c81)]:
  - @clarigen/core@0.3.2

## 0.3.1

### Patch Changes

- [`5a4e434`](https://github.com/obylabs/clarigen/commit/5a4e43484c9134db102a9ef8745a273a0c6c3018) Thanks [@hstove](https://github.com/hstove)! - Fixed an issue with integer conversion with clarity values. Resolved by updating `@stacks/transactions` dependency version

- Updated dependencies [[`5a4e434`](https://github.com/obylabs/clarigen/commit/5a4e43484c9134db102a9ef8745a273a0c6c3018)]:
  - @clarigen/core@0.3.1

## 0.2.3

### Patch Changes

- [`3e68eb1`](https://github.com/obylabs/clarigen/commit/3e68eb107c19c71af536a42d8120ac9e9a3b2c78) Thanks [@hstove](https://github.com/hstove)! - Fixed CI publish script

- Updated dependencies [[`3e68eb1`](https://github.com/obylabs/clarigen/commit/3e68eb107c19c71af536a42d8120ac9e9a3b2c78)]:
  - @clarigen/core@0.2.3

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
