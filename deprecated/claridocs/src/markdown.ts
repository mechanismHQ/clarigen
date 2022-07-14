import { ClarityAbi } from '@clarigen/core';
import { ClarityAbiFunction } from 'micro-stacks/clarity';
import { getTypeString } from 'micro-stacks/transactions';
import { basename } from 'path';
import { ClaridocContract, ClaridocFunction, ClaridocParam, Comments } from '.';

export function generateMarkdown({
  contract,
  abi,
  contractFile,
  contractName,
}: {
  contract: ClaridocContract;
  abi: ClarityAbi;
  contractFile: string;
  contractName: string;
}) {
  const functions = contract.functions.map(fn => markdownFunction(fn, contractFile));
  const fileName = basename(contractFile);

  return `
# ${contractName}

[\`${fileName}\`](${contractFile})

${contract.comments.join('\n')}

${markdownTOC(contract)}

## Functions

${functions.join('\n\n')}
`;
}

export function markdownFunction(fn: ClaridocFunction, contractFile: string) {
  const params = mdParams(fn);
  const returnType = getTypeString(fn.abi.outputs.type);
  const paramSigs = fn.abi.args.map(arg => {
    return `(${arg.name} ${getTypeString(arg.type)})`;
  });

  const startLine = fn.startLine + 1;

  const source = `<details>
  <summary>Source code:</summary>

\`\`\`clarity
${fn.source.join('\n')}
\`\`\`
</details>
`;

  const sig = `(define-${fn.abi.access.replace('_', '-')} (${fn.abi.name} (${paramSigs.join(
    ' '
  )}) ${returnType})`;

  return `### ${fn.abi.name}

[View in file](${contractFile}#L${startLine})

\`${sig}\`

${fn.comments.text.join('\n')}

${source}

${params}`;
}

function mdParams(fn: ClaridocFunction) {
  if (fn.abi.args.length === 0) return '';
  const params = Object.values(fn.comments.params).map(markdownParam);

  return `**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
${params.join('\n')}`;
}

function markdownParam(param: ClaridocParam) {
  const typeString = getTypeString(param.abi.type);
  return `| ${param.abi.name} | ${typeString} | ${param.comments.join('\n')} |`;
}

function markdownTOC(contract: ClaridocContract) {
  const publics = contract.functions.filter(fn => fn.abi.access === 'public');
  const readOnly = contract.functions.filter(fn => fn.abi.access === 'read_only');
  const privates = contract.functions.filter(fn => fn.abi.access === 'private');

  function tocLine(fn: ClaridocFunction) {
    const name = fn.abi.name;
    return `- [\`${name}\`](#${name})`;
  }

  return `**Public functions:**

${publics.map(tocLine).join('\n')}

**Read-only functions:**

${readOnly.map(tocLine).join('\n')}

**Private functions:**

${privates.map(tocLine).join('\n')}`;
}
