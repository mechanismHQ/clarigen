import { ClarityAbi } from '@clarigen/core';

// prettier-ignore
export const TestProjectInterface: ClarityAbi = {
  "clarity_version": "Clarity2",
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
                "length": 19
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
  "maps": [],
  "non_fungible_tokens": [],
  "variables": []
};
