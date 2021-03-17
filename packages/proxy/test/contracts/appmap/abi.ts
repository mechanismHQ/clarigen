import { ClarityAbi } from '@stacks/transactions';
export const appmap: ClarityAbi = {
  functions: [
    {
      name: 'is-storage-allowed',
      access: 'private',
      args: [
        {
          name: 'storage',
          type: 'int128',
        },
      ],
      outputs: {
        type: 'bool',
      },
    },
    {
      name: 'is-update-allowed',
      access: 'private',
      args: [],
      outputs: {
        type: 'bool',
      },
    },
    {
      name: 'register-app',
      access: 'public',
      args: [
        {
          name: 'owner',
          type: {
            buffer: {
              length: 80,
            },
          },
        },
        {
          name: 'app-contract-id',
          type: {
            buffer: {
              length: 100,
            },
          },
        },
        {
          name: 'storage-model',
          type: 'int128',
        },
      ],
      outputs: {
        type: {
          response: {
            ok: 'int128',
            error: 'uint128',
          },
        },
      },
    },
    {
      name: 'set-app-live',
      access: 'public',
      args: [
        {
          name: 'index',
          type: 'int128',
        },
        {
          name: 'owner',
          type: {
            buffer: {
              length: 80,
            },
          },
        },
        {
          name: 'app-contract-id',
          type: {
            buffer: {
              length: 100,
            },
          },
        },
        {
          name: 'storage-model',
          type: 'int128',
        },
      ],
      outputs: {
        type: {
          response: {
            ok: 'bool',
            error: 'uint128',
          },
        },
      },
    },
    {
      name: 'transfer-administrator',
      access: 'public',
      args: [
        {
          name: 'new-administrator',
          type: 'principal',
        },
      ],
      outputs: {
        type: {
          response: {
            ok: 'bool',
            error: 'uint128',
          },
        },
      },
    },
    {
      name: 'get-administrator',
      access: 'read_only',
      args: [],
      outputs: {
        type: 'principal',
      },
    },
    {
      name: 'get-app',
      access: 'read_only',
      args: [
        {
          name: 'index',
          type: 'int128',
        },
      ],
      outputs: {
        type: {
          response: {
            ok: {
              tuple: [
                {
                  name: 'app-contract-id',
                  type: {
                    buffer: {
                      length: 100,
                    },
                  },
                },
                {
                  name: 'owner',
                  type: {
                    buffer: {
                      length: 80,
                    },
                  },
                },
                {
                  name: 'status',
                  type: 'int128',
                },
                {
                  name: 'storage-model',
                  type: 'int128',
                },
              ],
            },
            error: 'uint128',
          },
        },
      },
    },
    {
      name: 'get-app-counter',
      access: 'read_only',
      args: [],
      outputs: {
        type: {
          response: {
            ok: 'int128',
            error: 'none',
          },
        },
      },
    },
  ],
  variables: [
    {
      name: 'illegal-storage',
      type: {
        response: {
          ok: 'none',
          error: 'uint128',
        },
      },
      access: 'constant',
    },
    {
      name: 'not-allowed',
      type: {
        response: {
          ok: 'none',
          error: 'uint128',
        },
      },
      access: 'constant',
    },
    {
      name: 'not-found',
      type: {
        response: {
          ok: 'none',
          error: 'uint128',
        },
      },
      access: 'constant',
    },
    {
      name: 'administrator',
      type: 'principal',
      access: 'variable',
    },
    {
      name: 'app-counter',
      type: 'int128',
      access: 'variable',
    },
  ],
  maps: [
    {
      name: 'app-map',
      key: [
        {
          name: 'index',
          type: 'int128',
        },
      ],
      value: [
        {
          name: 'app-contract-id',
          type: {
            buffer: {
              length: 100,
            },
          },
        },
        {
          name: 'owner',
          type: {
            buffer: {
              length: 80,
            },
          },
        },
        {
          name: 'status',
          type: 'int128',
        },
        {
          name: 'storage-model',
          type: 'int128',
        },
      ],
    },
  ],
  fungible_tokens: [],
  non_fungible_tokens: [],
};
