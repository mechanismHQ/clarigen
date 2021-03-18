import { Command, flags } from '@oclif/command';
import { resolve } from 'path';
import {
  generateIndexFile,
  generateInterface,
  generateInterfaceFile,
  makeTypes,
  getContractNameFromPath,
} from '@clarion/proxy';
import { mkdir, writeFile } from 'fs/promises';

export class Contract extends Command {
  static description = `Info
  `;
  static strict = true;

  static flags = {
    help: flags.help({ char: 'h' }),
    output: flags.string({
      char: 'o',
      description: 'Output destination folder',
      default: 'clarion',
    }),
  };

  static args = [
    {
      name: 'contract',
      description: 'The file path for your contract',
    },
  ];

  async run() {
    const { argv, flags } = this.parse(Contract);

    const [contractArg] = argv;

    const contractFile = resolve(process.cwd(), contractArg);

    const contractName = getContractNameFromPath(contractFile);

    const abi = await generateInterface({ contractFile });
    const typesFile = makeTypes(abi, contractName);
    const indexFile = generateIndexFile({ contractFile });
    const abiFile = generateInterfaceFile({ contractFile, abi });

    const outputPath =
      flags.output || resolve(process.cwd(), `tmp/${contractName}`);
    await mkdir(outputPath, { recursive: true });

    await writeFile(resolve(outputPath, 'abi.ts'), abiFile);
    await writeFile(resolve(outputPath, 'index.ts'), indexFile);
    await writeFile(resolve(outputPath, 'types.ts'), typesFile);
  }
}
