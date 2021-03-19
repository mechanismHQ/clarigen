import { Command, flags } from '@oclif/command';
import { generateProject } from '../utils';
import { getConfigFile } from '../config';
import { watch } from 'chokidar';
import ora from 'ora';
import { basename } from 'path';

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
      const spinner = ora('Generating files').start();
      const { contractsDir } = await getConfigFile(cwd);
      const watcher = watch([contractsDir], {
        cwd,
      });
      try {
        await generateProject(cwd);
        spinner.succeed(`Finished generating files. Watching for changes.`);
      } catch (error) {
        spinner.fail(`Error generating files.\n${error.message}`);
      }
      watcher.on('change', async (path) => {
        const file = basename(path);
        spinner.start(`Change detected for ${file}, generating.`);
        try {
          await generateProject(cwd);
          spinner.succeed(
            `Finished generating files for ${file}. Watching for changes.`
          );
        } catch (error) {
          spinner.fail(`Error on ${file}.\n${error.message}`);
        }
      });
      process.on('SIGINT', async () => {
        console.log('sigint');
        await watcher.close();
        process.exit();
      });
    } else {
      await generateProject(cwd);
    }
  }
}
