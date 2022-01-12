---
'@clarigen/cli': major
'@clarigen/core': major
'@clarigen/native-bin': major
'@clarigen/node': major
'@clarigen/test': major
'@clarigen/web': major
---

Migrates all packages to depend on `micro-stacks`. This allows for simplicity and much reduced bundle sizes.

Most APIs do not change at all, however, there are some breaking changes:

- The `buff` Clarity type now uses the `Uint8Array` native JS type, instead of `Buffer`
- Some TypeScript types that came from `@stacks/transactions` will break, like the `PostCondition` type
