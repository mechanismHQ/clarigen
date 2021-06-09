# `@clarigen/cli`

For setup instructions, check out the [Clarigen setup guide](https://github.com/hstove/clarigen#setup-guide).

Most of the time, you'll only need to run `clarigen` to automatically build your files. You can also run `clarigen --watch` to automatically generate files whenever you save one of your Clarity contracts.

# Usage

<!-- usage -->
```sh-session
$ npm install -g @clarigen/cli
$ clarigen COMMAND
running command...
$ clarigen (-v|--version|version)
@clarigen/cli/0.0.4 darwin-arm64 node-v15.14.0
$ clarigen --help [COMMAND]
USAGE
  $ clarigen COMMAND
...
```
<!-- usagestop -->

<!-- commands -->
* [`clarigen `](#clarigen-)
* [`clarigen contract [CONTRACT]`](#clarigen-contract-contract)
* [`clarigen generate`](#clarigen-generate)

## `clarigen `

Generate project files

```
USAGE
  $ clarigen

OPTIONS
  -h, --help   show CLI help
  -w, --watch  Watch for changes to your contracts
```

## `clarigen contract [CONTRACT]`

Generate files for a single contract

```
USAGE
  $ clarigen contract [CONTRACT]

ARGUMENTS
  CONTRACT  The file path for your contract

OPTIONS
  -h, --help           show CLI help
  -o, --output=output  [default: clarion] Output destination folder
```

## `clarigen generate`

Generate project files

```
USAGE
  $ clarigen generate

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
