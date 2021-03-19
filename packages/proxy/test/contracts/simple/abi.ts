import { ClarityAbi } from '@clarion/proxy';

// prettier-ignore
export const SimpleInterface: ClarityAbi = {
  "functions": [
    {
      "name": "get-name",
      "access": "public",
      "args": [],
      "outputs": {
        "type": {
          "response": {
            "ok": {
              "string-ascii": {
                "length": 12
              }
            },
            "error": "none"
          }
        }
      }
    },
    {
      "name": "get-number",
      "access": "read_only",
      "args": [],
      "outputs": {
        "type": "uint128"
      }
    }
  ],
  "variables": [],
  "maps": [],
  "fungible_tokens": [],
  "non_fungible_tokens": []
};
