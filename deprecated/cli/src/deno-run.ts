import { exec as _exec } from 'child_process';
import { promisify } from 'util';
import { homedir } from 'os';
import { resolve } from 'path';
import { ClarityAbi } from '@clarigen/core';

const exec = promisify(_exec);

export interface SessionContract {
  contract_id: string;
  contract_interface: ClarityAbi;
  source: string;
  dependencies: string[];
}

export interface Session {
  session_id: number;
  accounts: any[];
  contracts: SessionContract[];
}

export async function getClarinetSession(cwd?: string): Promise<Session> {
  const scriptPath =
    'https://raw.githubusercontent.com/mechanismHQ/clarigen-deno/main/src/cli/print.ts';
  const command = `clarinet run ${scriptPath}`;
  try {
    const result = await exec(command, { cwd });
    const sessionJSON = result.stdout.split('\n')[1];
    const session = JSON.parse(sessionJSON);
    return session as Session;
  } catch (error) {
    console.error(`Error getting clarinet session`);
    throw error;
  }
}
