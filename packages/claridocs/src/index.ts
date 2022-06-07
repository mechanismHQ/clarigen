import { ClarityAbi } from '@clarigen/core';
import { ClarityAbiFunction } from 'micro-stacks/clarity';
export * from './markdown';

export const FN_TYPES = ['read-only', 'public', 'private'];

export type ClarityAbiArg = ClarityAbiFunction['args'][0];

export interface ClaridocFunction {
  abi: ClarityAbiFunction;
  comments: Comments;
  startLine: number;
  source: string[];
}

export interface ClaridocContract {
  functions: ClaridocFunction[];
  comments: string[];
}

export interface ClaridocParam {
  abi: ClarityAbiArg;
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
      return;
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
      const metaComments = parseComments(comments, abiFn);
      currentFn = {
        abi: abiFn,
        comments: metaComments,
        startLine: lineNumber,
        source: [line],
      };
      if (parensCount === 0) {
        // end of fn - single line fn
        contract.functions.push(currentFn);
        currentFn = undefined;
      }
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

export interface Comments {
  params: Record<string, ClaridocParam>;
  text: string[];
}

export function parseComments(comments: string[], abi: ClarityAbiFunction): Comments {
  // const params: Record<string, ClaridocParam> = {};
  let curParam: string | undefined;
  // const newComments: string[] = [];
  const parsed: Comments = {
    text: [],
    params: {},
  };
  comments.forEach(line => {
    const paramMatches = line.match(/\s*@param\s([\w|\-]+)([;|-|\s]*)(.*)/);

    if (paramMatches === null) {
      if (!curParam || line.trim() === '') {
        curParam = undefined;
        parsed.text.push(line);
      } else {
        parsed.params[curParam].comments.push(line);
      }
      return;
    }

    const [full, name, separator, rest] = paramMatches;
    const arg = abi.args.find(arg => arg.name === name);
    if (!arg) {
      console.debug(`[claridocs]: Unable to find ABI for @param ${name}`);
      return;
    }
    curParam = name;
    parsed.params[curParam] = {
      abi: arg,
      comments: [rest],
    };
  });

  abi.args.forEach(arg => {
    if (!parsed.params[arg.name]) {
      parsed.params[arg.name] = {
        abi: arg,
        comments: [],
      };
    }
  });
  return parsed;
}
