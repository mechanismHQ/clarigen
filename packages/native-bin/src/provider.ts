import { spawn, SpawnOptions } from 'child_process';
import { Readable } from 'stream';
import { pipelineAsync, readStream } from './stream-util';

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export interface ExecuteOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  stdin?: Readable | string;
}

export async function executeCommand(
  command: string,
  args: string[],
  opts?: ExecuteOptions
): Promise<ExecutionResult> {
  const spawnOpts: SpawnOptions = {};
  if (opts) {
    if (opts.cwd) {
      spawnOpts.cwd = opts.cwd;
    }
    if (opts.env) {
      spawnOpts.env = opts.env;
    }
  }
  const proc = spawn(command, args, spawnOpts);

  if (proc.stdout === null || proc.stderr === null || proc.stdin === null) {
    throw new Error('clarity-cli spawn error');
  }

  const readStdout = readStream(proc.stdout, true);
  const readStderr = readStream(proc.stderr, true);

  let writeStdin: Promise<void> = Promise.resolve();
  if (opts && opts.stdin) {
    if (typeof opts.stdin === 'string') {
      proc.stdin.end(opts.stdin, 'utf8');
    } else {
      writeStdin = pipelineAsync(opts.stdin, proc.stdin).catch((error: any) => {
        console.debug(`spawn stdin error: ${String(error)}`);
      });
    }
  }

  proc.on('error', (error: any) => {
    console.error(`Unexpected process exec error: ${String(error)}`);
  });

  const exitCode = await new Promise<number>(resolve => {
    proc.once('close', (code: number) => {
      resolve(code);
    });
  });

  const [stdoutData, stderrData] = await Promise.all([readStdout, readStderr, writeStdin]);

  const stdoutStr = stdoutData.toString('utf8');
  const stderrStr = stderrData.toString('utf8');

  return {
    stdout: stdoutStr,
    stderr: stderrStr,
    exitCode: exitCode,
  };
}

export class NativeClarityBinProvider {
  public dbFilePath: string;
  public clarityBinPath: string;

  constructor(dbFilePath: string, clarityBinPath: string) {
    this.dbFilePath = dbFilePath;
    this.clarityBinPath = clarityBinPath;
  }

  /**
   * Run command against a local Stacks node VM.
   * Uses `clarity-cli` with the configured native bin path.
   * @param args clarity-cli commands.
   */
  async runCommand(args: string[], opts?: { stdin: string }) {
    const result = await executeCommand(this.clarityBinPath, [...args], {
      stdin: opts && opts.stdin,
    });

    // Normalize first EOL, and trim the trailing EOL.
    result.stdout = result.stdout.replace(/\r\n|\r|\n/, '\n').replace(/\r\n|\r|\n$/, '');

    // Normalize all stderr EOLs, trim the trailing EOL.
    result.stderr = result.stderr.replace(/\r\n|\r|\n/g, '\n').replace(/\r\n|\r|\n$/, '');

    return result;
  }
}
