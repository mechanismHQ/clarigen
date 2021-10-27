---
'@clarigen/cli': patch
'@clarigen/core': patch
'@clarigen/native-bin': patch
'@clarigen/test': patch
---

Fixed a bug where contracts that printed output on contract deploys would throw an error. For example, this contract:

```clar
(define-public (say-hi) (print "hello"))

(say-hi)
```

Would `print` when the contract deployed and cause an when Clarigen deployed it.
