---
'@clarigen/core': patch
'@clarigen/native-bin': patch
'@clarigen/node': patch
'@clarigen/test': patch
'@clarigen/web': patch
---

- Updated micro-stacks dependencies to latest (1.1.4)
- Added `ClarigenClient` wrapper to web package. Uses MicroStacksClient under the hood
- Use `micro-stacks/api` function for read-only calls
