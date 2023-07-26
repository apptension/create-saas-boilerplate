import { Command } from '@oclif/core';
import { Listr } from 'listr2';
import which from 'which';

const REQURED_COMMANDS = ['docker', 'pnpm'];

export const checkSystemReqs = async (command: Command): Promise<boolean> => {
  command.log('Performing system check:');
  const tasks = new Listr(
    REQURED_COMMANDS.map((cmd) => ({
      title: `Checking if ${cmd} is installed...`,
      task: async (_, task) => {
        const resolved = await which(cmd, { nothrow: true });
        if (!resolved) {
          throw new Error(`${cmd} is not installed!`);
        }

        task.title += ' it is!';
      },
    })),
    { concurrent: true, exitOnError: false }
  );
  await tasks.run();
  return tasks.err.length === 0;
};
