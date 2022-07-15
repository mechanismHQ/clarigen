---
'@clarigen/claridocs': patch
'@clarigen/cli': patch
'@clarigen/core': patch
'@clarigen/native-bin': patch
'@clarigen/node': patch
'@clarigen/test': patch
'@clarigen/web': patch
---

The CLI now uses `clarinet run` to get session info, which is much more consistent and handles requirements better. Factory and deployment code updated to handle this
