import { ClarityAbi } from '@clarigen/core';

// prettier-ignore
export const SimpleInterface: ClarityAbi = {
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
      "access": "public",
      "args": [],
      "name": "get-tuple-pub",
      "outputs": {
        "type": {
          "response": {
            "error": "none",
            "ok": {
              "tuple": [
                {
                  "name": "a",
                  "type": "uint128"
                },
                {
                  "name": "b",
                  "type": "bool"
                }
              ]
            }
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "for",
          "type": "bool"
        }
      ],
      "name": "fn-with-for",
      "outputs": {
        "type": "bool"
      }
    },
    {
      "access": "read_only",
      "args": [],
      "name": "get-buff",
      "outputs": {
        "type": {
          "buffer": {
            "length": 2
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [],
      "name": "get-tuple",
      "outputs": {
        "type": {
          "tuple": [
            {
              "name": "a",
              "type": "uint128"
            },
            {
              "name": "b",
              "type": "bool"
            }
          ]
        }
      }
    },
    {
      "access": "read_only",
      "args": [],
      "name": "get-tuple-resp",
      "outputs": {
        "type": {
          "response": {
            "error": "none",
            "ok": {
              "tuple": [
                {
                  "name": "a",
                  "type": "uint128"
                },
                {
                  "name": "b",
                  "type": "bool"
                },
                {
                  "name": "c",
                  "type": {
                    "tuple": [
                      {
                        "name": "d",
                        "type": "int128"
                      }
                    ]
                  }
                }
              ]
            }
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
