---
'@clarigen/claridocs': patch
'@clarigen/cli': patch
'@clarigen/core': patch
'@clarigen/native-bin': patch
'@clarigen/node': patch
'@clarigen/test': patch
'@clarigen/web': patch
---

Created a new generated file type through `@clarigen/cli`. New types allow Clarigen to only need a "typed ABI" in order to generate all of the same functionality. This greatly improve simplicity and portability. This new generated file has zero dependencies, meaning it can be used in Deno.
