---
'@clarigen/test': minor
---

The `@clarigen/test` package has been updated for the new v1 Clarigen types.

You can now more easily get logs and costs in function calls. Getting logs in a read-only call was not even possible previously without janky environment variables.

Also new are native getters for any maps in your contract, as well as support for arbitrary code execution.

Here's a code sample of what's new:

```typescript
import { TestProvider } from '@clarigen/test';
import { contracts, MyContract } from '../src/clarigen';

let t: TestProvider;
let contract: MyContract;

beforeAll(async () => {
  const { deployed, provider } = await TestProvider.fromContracts(contracts);
  t = provider;
});

// sample contract:
// (define-public (public-fn) (ok true))
// (define-read-only (read-fn (with-ok bool)) (if with-ok (ok u1) (err u0)))
// (define-map my-map uint bool)

// calling public fns
const txReceipt = await t.txOk(contract.publicFn(), alice);

// read-only (ro) functions
const roReceipt = await t.ro(contract.readFn());
console.log(roReceipt.logs);
console.log(roReceipt.costs);
console.log(roReceipt.value);

// helpers for getting the value of a read-only fn
const response = await t.rov(contract.readFn(true)); // Response<bigint, bigint>
// helpers for asserting and getting an ok/err value
const okVal = await t.rovOk(contract.readFn(true)); // 1n
const errVal = await t.rovErr(contract.readFn(false)); // 0n

// calling public fns in read-only mode
await t.rovOk(contract.publicFn()); // true

// map getters
await t.mapGet(contract.myMap(1n)); // bigint | null

// arbitrary code
const evalReceipt = await t.evalCode<bigint>('(+ u1 u2)');
console.log(evalReceipt.value, evalReceipt.costs, evalReceipt.logs);
// helper to eval and get return value
await t.eval<bigint>('(+ u1 u2)'); // 3n
// eval in a contract context
await t.eval('(public-fn)', contractAddr); // Response<boolean>
```
