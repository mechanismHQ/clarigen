---
'@clarigen/cli': patch
'@clarigen/test': patch
---

Contracts are now sorted using the `depends_on` property for Clarinet-integrated projects. Previously, contracts needed to be sorted in deploy order in `Clarinet.toml`.
