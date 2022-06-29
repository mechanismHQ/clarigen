import { ClarityAbi } from '@clarigen/core';

// prettier-ignore
export const TesterInterface: ClarityAbi = {
  "functions": [
    {
      "name": "print-err",
      "access": "public",
      "args": [],
      "outputs": {
        "type": {
          "response": {
            "ok": "none",
            "error": "uint128"
          }
        }
      }
    },
    {
      "name": "print-pub",
      "access": "public",
      "args": [],
      "outputs": {
        "type": {
          "response": {
            "ok": "bool",
            "error": "none"
          }
        }
      }
    },
    {
      "name": "set-in-map",
      "access": "public",
      "args": [
        {
          "name": "key",
          "type": "uint128"
        },
        {
          "name": "val",
          "type": "bool"
        }
      ],
      "outputs": {
        "type": {
          "response": {
            "ok": "bool",
            "error": "none"
          }
        }
      }
    },
    {
      "name": "set-num",
      "access": "public",
      "args": [
        {
          "name": "num",
          "type": "uint128"
        }
      ],
      "outputs": {
        "type": {
          "response": {
            "ok": "bool",
            "error": "none"
          }
        }
      }
    },
    {
      "name": "echo",
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
      "outputs": {
        "type": {
          "string-ascii": {
            "length": 33
          }
        }
      }
    },
    {
      "name": "echo-with-logs",
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
      "outputs": {
        "type": {
          "string-ascii": {
            "length": 33
          }
        }
      }
    },
    {
      "name": "ro-resp",
      "access": "read_only",
      "args": [
        {
          "name": "return-err",
          "type": "bool"
        }
      ],
      "outputs": {
        "type": {
          "response": {
            "ok": {
              "string-ascii": {
                "length": 4
              }
            },
            "error": "uint128"
          }
        }
      }
    }
  ],
  "variables": [
    {
      "name": "num-var",
      "type": "uint128",
      "access": "variable"
    }
  ],
  "maps": [
    {
      "name": "simple-map",
      "key": "uint128",
      "value": "bool"
    }
  ],
  "fungible_tokens": [],
  "non_fungible_tokens": []
};
