import { ClarityAbi } from '@stacks/transactions';

export const SimpleInterface: ClarityAbi = {
  functions: [
    {
      name: 'get-name',
      access: 'public',
      args: [],
      outputs: {
        type: {
          response: {
            ok: {
              'string-ascii': {
                length: 12,
              },
            },
            error: 'none',
          },
        },
      },
    },
  ],
  variables: [],
  maps: [],
  fungible_tokens: [],
  non_fungible_tokens: [],
};
