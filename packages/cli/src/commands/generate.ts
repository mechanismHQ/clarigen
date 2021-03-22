import { Command, flags } from '@oclif/command';
import { generateProject } from '../utils';
import { getConfigFile } from '../config';
import { watch } from 'chokidar';
import { basename } from 'path';
import { red, green } from 'chalk';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ora = require('ora');

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
        spinner.start(`Change detected for ${green(file)}, generating.`);
        try {
          await generateProject(cwd);
          spinner.succeed(
            `Finished generating files for ${green(
              file
            )}. Watching for changes.`
          );
        } catch (error) {
          spinner.fail(`Error on ${red(file)}.\n${error.message}`);
        }
      });
      process.on('SIGINT', async () => {
        await watcher.close();
        process.exit();
      });
    } else {
      await generateProject(cwd);
    }
  }
}
