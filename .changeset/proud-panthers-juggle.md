---
'@clarigen/core': patch
'@clarigen/node': patch
'@clarigen/web': patch
---

Updates the `ClarigenClient` constructor type to only rely on a `Network` with `getCoreApiUrl`. This will improve compatibility with Stacks.js
