# `@clarion/cli`

# Usage

<!-- usage -->
```sh-session
$ npm install -g @clarion/cli
$ clarion COMMAND
running command...
$ clarion (-v|--version|version)
@clarion/cli/1.0.8 darwin-arm64 node-v15.8.0
$ clarion --help [COMMAND]
USAGE
  $ clarion COMMAND
...
```
<!-- usagestop -->

<!-- commands -->
* [`clarion `](#clarion-)
* [`clarion contract [CONTRACT]`](#clarion-contract-contract)
* [`clarion generate`](#clarion-generate)

## `clarion `

Generate project files

```
USAGE
  $ clarion

OPTIONS
  -h, --help   show CLI help
  -w, --watch  Watch for changes to your contracts
```

## `clarion contract [CONTRACT]`

Generate files for a single contract

```
USAGE
  $ clarion contract [CONTRACT]

ARGUMENTS
  CONTRACT  The file path for your contract

OPTIONS
  -h, --help           show CLI help
  -o, --output=output  [default: clarion] Output destination folder
```

## `clarion generate`

Generate project files

```
USAGE
  $ clarion generate

OPTIONS
  -h, --help   show CLI help
  -w, --watch  Watch for changes to your contracts
```
<!-- commandsstop -->

## Development

To run the CLI:

```bash
yarn start ARGS_AND_FLAGS
```

This package uses `@vercel/ncc` to package the CLI into a single file. `yarn build` will also automatically update this README.

```bash
yarn build
```

To run the executable:

```bash
./bin/run ARGS_AND_FLAGS
```
