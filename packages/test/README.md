# `@clarigen/test`

`@clarigen/test` is a tool for running unit tests on Clarity smart contracts in a TypeScript environment.

For project setup instructions, check out the [Clarigen setup guide](https://github.com/hstove/clarigen#setup-guide).

This tool is agnostic to whichever testing framework you like to use. You're free to use Jest, Mocha, or whatever node.js testing library you enjoy.

Under the hood, this package uses the [`@clarigen/native-bin`](https://github.com/obylabs/clarigen/tree/main/packages/native-bin) package. At a lower level, the `clarity-cli` binary (from [`stacks-blockchain`](https://github.com/blockstack/stacks-blockchain)) is used to simulate a Stacks blockchain environment, especially for tests.

<!-- TOC depthfrom:2 -->

- [Guide](#guide)
  - [Importing Clarigen packages and modules](#importing-clarigen-packages-and-modules)
  - [Deploying contracts](#deploying-contracts)
  - [Interacting with contracts](#interacting-with-contracts)
    - [Read-only methods](#read-only-methods)
    - [Public functions](#public-functions)

<!-- /TOC -->

## Guide

All code samples are taken from the [Clarigen counter example](https://github.com/hstove/clarigen-counter-example) repository.

You can also see some real-world usage to better understand how to use it:

- [CounterCoin unit tests](https://github.com/hstove/clarigen-counter-example/blob/main/test/counter.test.ts)
- [Fungible token unit tests](https://github.com/hstove/stacks-fungible-token/blob/main/test/token.test.ts)

### Importing Clarigen packages and modules

When writing tests, you'll need to import each contract that you wish to deploy and use. Clarigen automatically generates and exports a few variables for each of your Clarity contracts. The one's you'll typically use are:

- `${contractName}Info` - An object that includes the contract file path and deployer address
- `${contractName}Contract` - a Typescript interface that represents the methods available on your contract

You'll also want to import `TestProvider` from `@clarigen/test`. You might also end up importing a few helper methods, which are explained later.

```ts
import { TestProvider, txErr, txOk } from '@clarigen/test';

// Make sure you import from the `outputDir` specified in clarigen.config.json
import { CounterContract, CounterCoinContract, contracts } from '../src/clarigen';
```

### Deploying contracts

You'll need to deploy contracts before running your tests. Typically, this is done using the `beforeAll` hook in Jest, or similar in your framework.

`TestProvider` includes a `fromContracts` method that accepts an object of your contracts.

**Important**: the order in which you specify contracts is important. Often times, one contract will depend on a different contract. Contracts are deployed in the order of which they are specified.

```ts
// `contracts` is imported from '../src/clarigen'
const deployed = await TestProvider.fromContracts(contracts);
```

The result of `TestProvider.fromContracts` is an object that includes all of your contract interfaces. This result is what you'll use to actually call contract methods. The keys of this object are the camel-cased file names of your contracts. So, `my-token.clar` will be `myToken`.

```ts
const { counter } = deployed;

// calling contract functions:
await counter.getCounter();
```

If you're using Clarinet with Clarigen, then you can automatically import and include your default account balances.

```ts
import { accounts, contracts } from '../src/clarigen';

await TestProvider.fromContracts(contracts, accounts);
```

### Interacting with contracts

There are two ways of interacting with a contract: read-only methods, and public methods.

#### Read-only methods

Read-only methods do not change state, so they can be called without making a transaction.

In the [counter example](https://github.com/hstove/clarigen-counter-example), there is the read-only method `get-counter`:

```clar
(define-data-var counter int 0)

(define-read-only (get-counter)
  (var-get counter))
```

Clarigen will automatically expose a JS-friendly method for calling this function and getting the result. Clarigen converts all method names from kebab-case (`get-counter`) to camelCase (`getCounter`).

```ts
const value = await counter.getCounter();
console.log(value); // prints "0n"
```

For most Clarity types, Clarigen converts values into JS-friendly values, and all methods are strongly typed to TypeScript types. In the above example, `getCounter` returns a `number`.

Sometimes, read-only methods return a `response`. A `response` is a value that can be either "ok" or an error. The type returned for `ok` and `err` are different. Clarigen returns a [neverthrow](https://github.com/supermacro/neverthrow) type for read-only functions that return a `response`. Refer to the neverthrow docs for full usage.

For an example, here is a read-only function that returns a `response`:

```clar
(define-read-only (check-even (x uint))
  (if (is-eq (mod x 2) 0)
    (ok x)
    (err false))
)
```

If the response is `ok`, it returns a number, otherwise it returns a boolean for `err`. Here's what that looks like with Clarigen:

```ts
const response = await myContract.checkEven(3);
if (response.isOk) {
  console.log('Ok', response.value); // prints "Ok 3"
} else {
  console.log('Err', response.value); // prints "Err false"
}
```

#### Public functions

Public functions are callable by anyone, and are invoked by making a contract-call transaction. In a test environment, we are simulating a full blockchain, but the behavior is the same.

`@clarigen/test` provides a few helper functions for submitting a transaction:

- `tx`: Submit a transaction and get a response (which can be either `ok` or `err`)
- `txOk`: Submit a transaction and throw an error if the result is not `ok`
- `txErr`: Submit a transaction and throw and error if the response is not `err`

The API for these helper methods is `tx(Transaction<Ok, Err>, sender: string)`. Here are some examples:

```ts
import { tx, txOk, txErr } from '@clarigen/test';

const sender = 'ST3J2GVMMM2R07ZFBJDWTYEYAR8FZH5WKDTFJ9AHA';

// Submit a tx. The type of `responseMaybe.value` is either `ok`, or `err`, so
// you must check `isOk` before writing type-safe code
const responseMaybe = await tx(counter.increment(), sender);

// `responseOk.value` is strictly typed, because the helper will throw if `isOk !== true`
const responseOk = await txOk(counter.increment(), sender);

// `responseErr.value` is strictly typed, because the helper will throw if `isOk !== false`
const responseErr = await txErr(counter.increment(), sender);
```

The return type of these methods are specified below. `tx` returns `TransactionResult<Ok, Err>`, `txOk` returns `TransactionResultOk`, and `txErr` returns `TransactionResultErr`.

```ts
export interface TransactionResultOk<Ok> {
  value: Ok;
  response: ResponseOk<Ok>;
  isOk: true;
  events: any[];
  costs: {
    runtime: number;
  };
  assets: ResultAssets;
}

export interface TransactionResultErr<Err> {
  value: Err;
  response: ResponseErr<Err>;
  costs: {
    runtime: number;
  };
  isOk: false;
}

export type TransactionResult<Ok, Err> = TransactionResultOk<Ok> | TransactionResultErr<Err>;
```
