---
'@clarigen/core': patch
---

- Fixed an issue with generically typed `projectFactory`, where contracts without mainnet deployments were typed as 'undefined'.
- Exports `UnknownArg` and `UnknownArgs`;
- Fixed an issue with `parseToCV` where an `(optional uint)` would return `none` when given a zero value (ie `0` or `0n`).
