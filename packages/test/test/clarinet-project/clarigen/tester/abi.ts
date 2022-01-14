import { ClarityAbi } from '@clarigen/core';

// prettier-ignore
export const TesterInterface: ClarityAbi = {
  "functions": [
    {
      "access": "public",
      "args": [],
      "name": "print-err",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": "none"
          }
        }
      }
    },
    {
      "access": "public",
      "args": [],
      "name": "print-pub",
      "outputs": {
        "type": {
          "response": {
            "error": "none",
            "ok": "bool"
          }
        }
      }
    },
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
    },
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
      "name": "echo-with-logs",
      "outputs": {
        "type": {
          "string-ascii": {
            "length": 33
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "return-err",
          "type": "bool"
        }
      ],
      "name": "ro-resp",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": {
              "string-ascii": {
                "length": 4
              }
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
