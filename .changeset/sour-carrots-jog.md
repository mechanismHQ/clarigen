---
'@clarigen/cli': patch
'@clarigen/core': patch
---

Updates the native `Response` type so that generics are properly included in both `Ok` and `Err` type.

Also fixed a bug when generating the new output, where long arrays were improperly serialized.
