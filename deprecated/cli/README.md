# `@clarigen/cli`

For setup instructions, check out the [Clarigen setup guide](https://github.com/hstove/clarigen#setup-guide).

Most of the time, you'll only need to run `clarigen` to automatically build your files. You can also run `clarigen --watch` to automatically generate files whenever you save one of your Clarity contracts.

# Usage

<!-- commands -->

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
