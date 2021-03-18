import { Command, flags } from '@oclif/command';
import { generateFilesForContract } from '../utils';

export class Contract extends Command {
  static description = `Generate files for a single contract`;
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

    const [contractFile] = argv;

    await generateFilesForContract({
      contractFile,
      outputFolder: flags.output,
    });
  }
}
