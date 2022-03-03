---
'@clarigen/core': patch
'@clarigen/test': patch
---

Fixed an issue where deploying contracts in the test adapter didn't use the contracts specified name. Instead, it inferred the contract name from the contract file.
