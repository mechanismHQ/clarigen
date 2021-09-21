import { ClarityAbi } from '@clarigen/core';

// prettier-ignore
export const EchoInterface: ClarityAbi = {
  "functions": [
    {
      "access": "read_only",
      "args": [
        {
          "name": "val",
          "type": {
            "string-ascii": {
              "length": 33
            }
          }
        }
      ],
      "name": "echo",
      "outputs": {
        "type": {
          "string-ascii": {
            "length": 33
          }
        }
      }
    }
  ],
  "fungible_tokens": [],
  "maps": [],
  "non_fungible_tokens": [],
  "variables": []
};
