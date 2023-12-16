import { Response, cvToValue } from '@clarigen/core';
import {
  ClarityValue as HiroClarityValue,
  deserializeCV as deserializeCVHiro,
  serializeCV as serializeCVHiro,
  StandardPrincipalCV as HiroPrincipalCV,
} from '@stacks/transactions';
import {
  ClarityValue as MSClarityValue,
  StandardPrincipalCV as MSPrincipalCV,
  serializeCV as serializeCVMS,
  deserializeCV as deserializeCVMS,
  ClarityAbiFunction,
  Address,
  ClarityType,
} from 'micro-stacks/clarity';

export function cvConvertMS(value: MSClarityValue): HiroClarityValue {
  return deserializeCVHiro(serializeCVMS(value));
}

export function cvConvertHiro(value: HiroClarityValue): MSClarityValue {
  return deserializeCVMS(serializeCVHiro(value));
}

export function validateResponse<T>(result: HiroClarityValue, expectOk?: boolean): T {
  const value = cvToValue(cvConvertHiro(result), true);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  if (!value.hasOwnProperty('isOk') && typeof expectOk !== 'undefined') {
    throw new Error(
      `Expected response when calling function, but not a response. Try using just \`tx\` or \`rov\``
    );
  }
  if (typeof expectOk !== 'undefined' && 'isOk' in value) {
    const response = value as Response<unknown, unknown>;
    const inner = response.value;
    if (expectOk && !response.isOk) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Tx result failed. Expected OK, received ERR ${inner}.`);
    }
    if (expectOk === false && response.isOk) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Tx result failed. Expected ERR, received OK ${inner}.`);
    }
    return inner as T;
  }
  return value as T;
}
