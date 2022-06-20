import { Command, flags } from '@oclif/command';
import { generateProject } from '../utils';
import { getProjectConfig } from '../config';
import { watch } from 'chokidar';
import { basename } from 'path';
import { red, green } from 'chalk';
import ora from 'ora';

export class Generate extends Command {
  static description = `Generate project files`;
  static strict = true;
  static hidden = false;

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
      const { contractsDir } = await getProjectConfig(cwd);
      const watcher = watch([contractsDir], {
        cwd,
      });
      try {
        await generateProject(cwd);
        spinner.succeed(`Finished generating files. Watching for changes.`);
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        spinner.fail(`Error generating files.\n${String(error.message)}`);
      }
      watcher.on('change', (path) => {
        const cb = async () => {
          const file = basename(path);
          spinner.clear();
          spinner.start(`Change detected for ${green(file)}, generating.`);
          try {
            await generateProject(cwd);
            spinner.succeed(
              `Finished generating files for ${green(
                file
              )}. Watching for changes.`
            );
          } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const msg = error.message as string;
            spinner.fail(`Error after saving ${red(file)}.\n${msg}`);
          }
        };
        void cb();
      });
      process.on('SIGINT', () => {
        async function cb() {
          await watcher.close();
          process.exit();
        }
        void cb();
      });
    } else {
      await generateProject(cwd);
    }
  }
}
