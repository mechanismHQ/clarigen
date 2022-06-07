import { ClarityAbi } from '@clarigen/core';
import { ClarityAbiFunction } from 'micro-stacks/clarity';

export const FN_TYPES = ['read-only', 'public', 'private'];

export interface ClaridocFunction {
  abi: ClarityAbiFunction;
  comments: string[];
  startLine: number;
  source: string[];
}

export interface ClaridocContract {
  functions: ClaridocFunction[];
  comments: string[];
}

export function createContractDocInfo({
  contractSrc,
  abi,
}: {
  contractSrc: string;
  abi: ClarityAbi;
}): ClaridocContract {
  const lines = contractSrc.split('\n');
  let comments: string[] = [];
  let parensCount = 0;
  let currentFn: ClaridocFunction | undefined;
  // const functions: ClaridocFunction[] = [];
  const contract: ClaridocContract = {
    comments: [],
    functions: [],
  };
  lines.forEach((line, lineNumber) => {
    // Are we processing a function?
    if (currentFn) {
      currentFn.source.push(line);
      parensCount = traceParens(line, parensCount);
      if (parensCount === 0) {
        // end of fn
        contract.functions.push(currentFn);
        currentFn = undefined;
      }
    }
    // Are we gathering comments?
    if (isComment(line)) {
      const comment = line.replace(/^\s*;;\s*/g, '');
      if (contract.comments.length === lineNumber) {
        // Top-level contract comments
        contract.comments.push(comment);
      } else {
        // Aggregate for a function
        comments.push(comment);
      }
      return;
    }

    // Is this the start of a fn?
    const name = getFnName(line);
    if (typeof name === 'undefined') {
      // Not a comment or fn start, clear comments.
      comments = [];
    } else {
      // New function found.
      const abiFn = abi.functions.find(fn => {
        return fn.name === name;
      });
      if (!abiFn) {
        console.debug(`[claridoc]: Unable to find ABI for function \`${name}\`. Probably a bug.`);
        return;
      }
      parensCount = traceParens(line, 0);
      currentFn = {
        abi: abiFn,
        comments,
        startLine: lineNumber,
        source: [line],
      };
      comments = [];
    }
  });
  return contract;
}

export function isComment(line: string) {
  return line.startsWith(';;');
}

export function getFnName(line: string) {
  const fnType = FN_TYPES.find(type => {
    return line.startsWith(`(define-${type}`);
  });
  if (typeof fnType === 'undefined') return;
  const prefix = `(define-${fnType} (`;
  const startString = line.slice(prefix.length);
  const match = startString.match(/[\w|\-]+/);
  if (!match) {
    console.debug(`[claridocs]: Unable to determine function name from line:\n  \`${line}\``);
    return;
  }
  return match[0];
}

export function traceParens(line: string, count: number) {
  let newCount = count;
  line.split('').forEach(char => {
    if (char === '(') newCount++;
    if (char === ')') newCount--;
  });
  return newCount;
}
