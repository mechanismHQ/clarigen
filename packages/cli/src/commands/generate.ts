import { Command, flags } from '@oclif/command';
import { generateProject } from '../utils';
import { getConfigFile } from '../config';
import { watch } from 'chokidar';

export class Generate extends Command {
  static description = `Generate project files`;
  static strict = true;

  static flags = {
    help: flags.help({ char: 'h' }),
    watch: flags.boolean({
      char: 'w',
      description: 'Watch for changes to your contracts',
    }),
  };

  static args = [];

  async run() {
    const { flags } = this.parse(Generate);
    const cwd = process.cwd();

    if (flags.watch) {
      const { contractsDir } = await getConfigFile(cwd);
      const watcher = watch([contractsDir], {
        cwd,
      });
      this.log('Generating files');
      await generateProject(cwd);
      watcher.on('change', async (path) => {
        this.log(`Change detected for ${path}, generating.`);
        await generateProject(cwd);
        this.log('Finished.');
      });
      // const { contracts}
    } else {
      await generateProject(cwd);
    }
  }
}
