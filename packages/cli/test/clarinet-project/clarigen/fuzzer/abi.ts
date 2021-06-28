import { ClarityAbi } from '@clarigen/core';

// prettier-ignore
export const FuzzerInterface: ClarityAbi = {
  "functions": [
    {
      "access": "public",
      "args": [],
      "name": "get-name",
      "outputs": {
        "type": {
          "response": {
            "error": "none",
            "ok": {
              "string-ascii": {
                "length": 12
              }
            }
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [],
      "name": "get-number",
      "outputs": {
        "type": "uint128"
      }
    }
  ],
  "fungible_tokens": [],
  "maps": [
    {
      "key": "uint128",
      "name": "basic-map",
      "value": "bool"
    },
    {
      "key": {
        "tuple": [
          {
            "name": "a",
            "type": {
              "string-ascii": {
                "length": 10
              }
            }
          }
        ]
      },
      "name": "tuple-map",
      "value": {
        "tuple": [
          {
            "name": "b",
            "type": "uint128"
          }
        ]
      }
    }
  ],
  "non_fungible_tokens": [],
  "variables": [
    {
      "access": "constant",
      "name": "ERR_SOMETHING",
      "type": "uint128"
    },
    {
      "access": "variable",
      "name": "my-var",
      "type": "uint128"
    }
  ]
};
