# Clarigen

<!-- TOC depthfrom:2 -->

- [Example projects:](#example-projects)
- [Why?](#why)
- [How it works](#how-it-works)
  - [The "provider pattern"](#the-provider-pattern)
- [Setup guide](#setup-guide)
  - [Install NPM package](#install-npm-package)
    - [Install from source](#install-from-source)
    - [Download a pre-built version](#download-a-pre-built-version)
  - [Create a /contracts folder](#create-a-contracts-folder)
  - [Create a clarigen.config.json file:](#create-a-clarigenconfigjson-file)
  - [Generate Clarigen interfaces](#generate-clarigen-interfaces)
- [Usage with Clarinet](#usage-with-clarinet)

<!-- /TOC -->

Clarigen is a developer tool that automatically generates TypeScript-friendly clients that can interact with [Clarity](https://clarity-lang.org) smart contracts.

The workflow for using Clarigen is usually:

- Write your Clarity contracts under a `/contracts` folder
- Automatically generate interfaces for your contracts with `yarn clarigen --watch`
- Write unit tests using [`@clarigen/test`](https://github.com/hstove/clarigen/tree/main/packages/test)
- _[In Development]_ Build your web app using [`@clarigen/web`](https://github.com/hstove/clarigen/tree/main/packages/web)
- _[Coming soon]_ Write script and server-side code with `@clarigen/node`

## Example projects:

- [Fungible token](https://github.com/hstove/stacks-fungible-token): the reference implementation that goes along with SIP-010, the standard for fungible tokens on Stacks
- [Counter](https://github.com/hstove/clarigen-counter-example): A simple and silly counter contract that mints a fungible token any time someone calls `increment` or `decrement`

## Why?

When you're building Clarity contracts, and Clarity apps, there is a ton of boilerplate code that you need to write. Similarly, you need to use a different library, with a different API, depending on if you're writing tests, web apps, or node.js code.

On the other hand, Clarity's designs mean that we shouldn't have to write lots of boilerplate. Clarity code is fully type-safe, and isn't compiled, so it's easy to generate a type interface for every single Clarity contract.

Clarigen aims to provide two goals:

- Provide an easy, JS-friendly API for any type of contract interaction. Never have to deal with converting Clarity values into JS values
- Provide a single unified API regardless of the environment you're developing in

## How it works

The magic behind Clarigen starts with the fact that any Clarity contract can be represented as a machine-readable interface, exposed in JSON format. In other blockchains, this is commonly referred to as an ABI. The interface for a contract looks something like this:

```json
{
  "functions": [
    {
      "name": "decrement",
      "access": "public",
      "args": [],
      "outputs": {
        "type": {
          "response": {
            "ok": "int128",
            "error": "none"
          }
        }
      }
    }
  ]
}
```

Clarigen will generate the JSON interface for your contracts and turn it into type-safe JavaScript code, using JS primitives.

After Clarigen automatically generates a wrapper for each of your contracts, you can write code that looks like this:

```ts
import { TestProvider } from '@clarigen/test';
import { counterInfo } from '@contracts/counter';

const { counter } = await TestProvider.fromContracts({
  counter: counterInfo,
});

const sender = 'ST3J2GVMMM2R07ZFBJDWTYEYAR8FZH5WKDTFJ9AHA';

test('Calling `decrement` on my counter contract', async () => {
  const prev = await counter.getCounter();
  expect(prev).toEqual(4);
  const tx = counter.decrement();
  const receipt = await tx.submit({ sender });
  expect(receipt.isOk).toEqual(true);
  const newValue = await counter.getCounter();
  expect(newValue).toEqual(3);
});
```

Clarity has it’s own set of [built-in types](https://docs.blockstack.org/references/language-types), but Clarigen will convert them to JavaScript native values behind the scenes. This way, you can pass arguments and check results just like you would with any JavaScript library.

### The "provider pattern"

Clarigen is designed to provide a unified API that can work in multiple different environments. Whether you’re writing unit tests or building a web app, developers can invoke functions using the same API (like `contract.getTotalSupply()`), even though what actually happens in those environments is totally different. The “provider pattern” can be helpful when writing code for this kind of situation.

Clarigen currently provides two providers - `WebProvider` and `TestProvider`. Soon, it’ll also include a `NodeProvider`, which can be used in server-side and scripting contexts.

Each provider has a common interface, with functions like `callPublic`. `TestProvider` uses `clarity-js-sdk` to run Clarity code and get the result. `WebProvider` uses `@stacks/connect` for making transaction signing requests with the [Stacks Wallet for Web](https://www.hiro.so/wallet/install-web).

## Setup guide

To start, this guide assumes you have a local project folder with Typescript already configured. If you don't then the easiest way to build one is with [`tsdx`](https://tsdx.io), using the "basic" template:

```sh
npx tsdx create my-clarigen-project
```

### Install NPM package

To setup a project, install the `@clarigen/cli` package.

**Important**: Right now, Clarigen relies on an unreleased version of `clarity-cli`, which is created from the [`stacks-blockchain`](https://github.com/blockstack/stacks-blockchain) repository. When installing, you'll need to specify this custom version. You have two options:

#### 1. Install from source

You can build `clarity-cli` from source by specifying the correct branch of the `stack-blockchain` repo to build from. You may need to have the Rust toolchain already installed. Docs can be found on the [`stacks-blockchain` README](https://github.com/blockstack/stacks-blockchain).

```sh
# with yarn
BLOCKSTACK_CORE_SOURCE_BRANCH=feat/clarity-cli-serialized-output yarn add --dev @clarigen/cli

# with npm
BLOCKSTACK_CORE_SOURCE_BRANCH=feat/clarity-cli-serialized-output npm install --save-dev @clarigen/cli
```

It may take a few minutes to build from source.

#### 2. Download a pre-built version

You can download a built version of `clarity-cli` from [Github Actions artifacts](https://github.com/blockstack/stacks-blockchain/actions?query=branch%3Adevelop). Make sure to download the correct build for your system. If you are on Apple Silicon, pre-built binaries are not yet available, and you'll need to install from source.

Once downloaded, use an environment variable to point to the path where `clarity-cli` is installed, inside the unzipped folder you just downloaded.

```sh
# with yarn
BLOCKSTACK_CORE_SOURCE_PATH=/path-to-file/clarity-cli yarn add --dev @clarigen/cli

# with npm
BLOCKSTACK_CORE_SOURCE_PATH=/path-to-file/clarity-cli npm install --save-dev @clarigen/cli
```

### Create a `/contracts` folder

Create a `/contracts` folder in your project, and add a Clarity smart contract to it. For example, make a `hello-world.clar` file with this Clarity code:

```clar
(define-public (say-hi)
  (ok "hello, world")
)
```

### Create a `clarigen.config.json` file:

Clarigen's CLI uses a JSON configuration file to know how to deploy your contracts. Add the following to your file:

```json
{
  "contractsDir": "contracts",
  "outputDir": "src/clarigen",
  "contracts": [
    {
      "file": "hello-world.clar",
      "address": "ST50GEWRE7W5B02G3J3K19GNDDAPC3XPZPYQRQDW"
    }
  ]
}
```

The `contractsDir` option specifies the folder where your Clarity contracts live.

`outputDir` specifies where the automatically-generated TypeScript files should go.

`contracts` is an array of each of your contracts. The `address` specifies who the deployer is of this contract. In this example, the contract will be deployed as `ST50GEWRE7W5B02G3J3K19GNDDAPC3XPZPYQRQDW.hello-world`.

The order of entries in the `contracts` array is important. When generating interfaces, each entry is deployed in the order specified. So, if one contract depends on another, then make sure that contract is listed _after_ the other one.

### Generate Clarigen interfaces

We're all set up! Now, you can run the `clarigen` command and generate interfaces for your project.

```sh
# with yarn
yarn clarigen

# with npm
npx clarigen
```

You should see a new folder created at `src/clarigen/hello-world`. You will have a different folder for each contract specified. These folders include the TypeScript interfaces, and other metadata, to allow each of Clarigen's adapters to interace with it.

## Usage with Clarinet

[Clarinet](https://github.com/hirosystems/clarinet) is another fantastic dev tool for building Clarity contracts.

How is Clarinet different from Clarigen?

- Clarigen is more intended for strictly creating an excellent Typescript developer experience, so that you can run the same exact code in any environment (unit tests, node.js scripts, and web apps)
- Clarigen utilizes node.js, whereas Clarinet supports Typescript unit tests in Deno. At the moment, the tools are not compatible for unit testing
- Clarinet provides an out-of-the-box REPL and notebooks experience, which is invaluable for iterating on contracts
- Clarigen generates type-safe and convenient interfaces to your contracts, whereas Clarinet unit tests are less strongly typed

**Ultimately, the two tools are best used in tandem**

It's really easy to have a project that uses both Clarigen and Clarinet. You'll still need to install the dependencies listed above, but your `clarigen.config.json` file can simply reference that you're using Clarinet:

```json
{
  "outputDir": "src/clarigen",
  "clarinet": "my-clarinet-folder"
}
```

Or, to indicate that Clarinet is at the root level of your project, you can set `"clarinet": "."` in your configuration.

When Clarigen sees this configuration, it fetches all contract information from Clarinet's configuration files (i.e. `Clarinet.toml` and `settings/Development.toml`).
