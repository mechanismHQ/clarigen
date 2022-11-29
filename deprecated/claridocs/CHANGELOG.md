# @clarigen/claridocs

## 1.0.0

### Patch Changes

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`a131614`](https://github.com/mechanismHQ/clarigen/commit/a1316142a5bec9e949dd6cacd3328fa2941e12fc) Thanks [@hstove](https://github.com/hstove)! - Updated CLI package to support all config living in `Clarinet.toml`

* [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`0d9414f`](https://github.com/mechanismHQ/clarigen/commit/0d9414fa8e09df10548a5000a37ac66f60f509fc) Thanks [@hstove](https://github.com/hstove)! - Moved internal package management from yarn to pnpm.

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`c69a6c9`](https://github.com/mechanismHQ/clarigen/commit/c69a6c9b8c185f840f38759aa7a530ee54f85c57) Thanks [@hstove](https://github.com/hstove)! - Adds a new package, Claridocs! Claridocs will automatically parse comments from your contracts and generate a markdown file for every contract in your project.

* [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`0b786bc`](https://github.com/mechanismHQ/clarigen/commit/0b786bc0ebcff900514d555c86f73677f5360f6c) Thanks [@hstove](https://github.com/hstove)! - The CLI now uses `clarinet run` to get session info, which is much more consistent and handles requirements better. Factory and deployment code updated to handle this

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`8ae1862`](https://github.com/mechanismHQ/clarigen/commit/8ae18623f3535550c1707642dbde9ec79ae87585) Thanks [@hstove](https://github.com/hstove)! - Created a new generated file type through `@clarigen/cli`. New types allow Clarigen to only need a "typed ABI" in order to generate all of the same functionality. This greatly improve simplicity and portability. This new generated file has zero dependencies, meaning it can be used in Deno.

* [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`06ac766`](https://github.com/mechanismHQ/clarigen/commit/06ac7660898a481131082c83172afc3c2a8b80f9) Thanks [@hstove](https://github.com/hstove)! - Fix version bumps

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`d116788`](https://github.com/mechanismHQ/clarigen/commit/d116788fd5f8cfa4a14716c2c7c54f435cb01884) Thanks [@hstove](https://github.com/hstove)! - Adds parsing and saving of deployment plans in typescript form.

* [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`f1cc407`](https://github.com/mechanismHQ/clarigen/commit/f1cc407fe3430e79468d38b5acdb60cf051ea5c5) Thanks [@hstove](https://github.com/hstove)! - Adds an index-level docs page when generating docs

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`1a94545`](https://github.com/mechanismHQ/clarigen/commit/1a94545e482d42cc842e241d5484c69bb9188e7c) Thanks [@hstove](https://github.com/hstove)! - Fixed a bug where the CLI exported invalid types for Response

- Updated dependencies [[`b28428e`](https://github.com/mechanismHQ/clarigen/commit/b28428ea807a503ef3eb4420e95e375de4573ddf), [`6916cb8`](https://github.com/mechanismHQ/clarigen/commit/6916cb8ea69715634399a4a48680323257c35719), [`3ee7d9a`](https://github.com/mechanismHQ/clarigen/commit/3ee7d9a28eabfaced6ee073b42f9c48910819e7d), [`2480675`](https://github.com/mechanismHQ/clarigen/commit/2480675c36da569870e36feba714cc22d849654a), [`15e3f96`](https://github.com/mechanismHQ/clarigen/commit/15e3f96201ddd9f95ce361a0559e3b15df679f59), [`d415cab`](https://github.com/mechanismHQ/clarigen/commit/d415cabfa80f32eee6adb2027d6073011f5cc53f), [`a131614`](https://github.com/mechanismHQ/clarigen/commit/a1316142a5bec9e949dd6cacd3328fa2941e12fc), [`0413049`](https://github.com/mechanismHQ/clarigen/commit/041304944c408b0bdf4e6dcf3cd5c24025f473e0), [`a585ecb`](https://github.com/mechanismHQ/clarigen/commit/a585ecb3eb44d2a7b6a6850dcc5f01f76ba43b3c), [`0d9414f`](https://github.com/mechanismHQ/clarigen/commit/0d9414fa8e09df10548a5000a37ac66f60f509fc), [`741c968`](https://github.com/mechanismHQ/clarigen/commit/741c9687ef5e11a26c80f02233905136403ac940), [`ab39cc9`](https://github.com/mechanismHQ/clarigen/commit/ab39cc98dc1fca1b7c6f11e5e39b44df87f2b0f2), [`1727e49`](https://github.com/mechanismHQ/clarigen/commit/1727e49ba456130115c310527c93c562a07f1716), [`735a83b`](https://github.com/mechanismHQ/clarigen/commit/735a83b6632362a55f4849b23d6fb7a482a316ae), [`b4ee542`](https://github.com/mechanismHQ/clarigen/commit/b4ee5428e1e5f7606824648bba5c9d389a05d2e3), [`2e62568`](https://github.com/mechanismHQ/clarigen/commit/2e6256853efab622c3d61039c1d55073cb72ff17), [`514ca19`](https://github.com/mechanismHQ/clarigen/commit/514ca1949f4c9905a67f4462dd3a189baad393dc), [`512ef53`](https://github.com/mechanismHQ/clarigen/commit/512ef53c5256acb3fdaf7e836e009d7af5571189), [`b2f0d85`](https://github.com/mechanismHQ/clarigen/commit/b2f0d85e7385e83f6e3649b0b8bb2ff6005bd429), [`0dfd00d`](https://github.com/mechanismHQ/clarigen/commit/0dfd00d893c1a10317fe49818b0655e428fb210b), [`5a1f20b`](https://github.com/mechanismHQ/clarigen/commit/5a1f20b442ce8d498c2b49abb8dc6680f90fec01), [`b8988e7`](https://github.com/mechanismHQ/clarigen/commit/b8988e7ec734324de005a7b271d0a03b4cec6d37), [`0b786bc`](https://github.com/mechanismHQ/clarigen/commit/0b786bc0ebcff900514d555c86f73677f5360f6c), [`8ae1862`](https://github.com/mechanismHQ/clarigen/commit/8ae18623f3535550c1707642dbde9ec79ae87585), [`befda6b`](https://github.com/mechanismHQ/clarigen/commit/befda6bd4d3c480527ad75d2e1c873f5934c5979), [`06ac766`](https://github.com/mechanismHQ/clarigen/commit/06ac7660898a481131082c83172afc3c2a8b80f9), [`3005b7f`](https://github.com/mechanismHQ/clarigen/commit/3005b7ff8c84089ae969dbcb3620aa48de35c7f8), [`d116788`](https://github.com/mechanismHQ/clarigen/commit/d116788fd5f8cfa4a14716c2c7c54f435cb01884), [`f153dc4`](https://github.com/mechanismHQ/clarigen/commit/f153dc4aecc8d65a01933dbe65dd90f85d884756), [`f1cc407`](https://github.com/mechanismHQ/clarigen/commit/f1cc407fe3430e79468d38b5acdb60cf051ea5c5), [`7b5ce6d`](https://github.com/mechanismHQ/clarigen/commit/7b5ce6db6460a313924a976e1cfaca3fdbb4dc49), [`1a94545`](https://github.com/mechanismHQ/clarigen/commit/1a94545e482d42cc842e241d5484c69bb9188e7c)]:
  - @clarigen/core@1.0.0

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

- [#30](https://github.com/mechanismHQ/clarigen/pull/30) [`c69a6c9`](https://github.com/mechanismHQ/clarigen/commit/c69a6c9b8c185f840f38759aa7a530ee54f85c57) Thanks [@hstove](https://github.com/hstove)! - Adds a new package, Claridocs! Claridocs will automatically parse comments from your contracts and generate a markdown file for every contract in your project.

- Updated dependencies [[`6916cb8`](https://github.com/mechanismHQ/clarigen/commit/6916cb8ea69715634399a4a48680323257c35719)]:
  - @clarigen/core@1.0.0-next.15
