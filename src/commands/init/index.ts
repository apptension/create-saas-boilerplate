import { Args, Command, Flags, ux } from '@oclif/core';
import { CleanOptions, SimpleGit, simpleGit } from 'simple-git';

import { PROJECT_NAME, REPOSITORY_URL } from '../../config';
import { prepareInitDirectory, removeGit } from '../../utils/dirs';
import { checkSystemReqs } from '../../utils/system-check';

export default class Init extends Command {
  static description = `Initialize new ${PROJECT_NAME} project`;

  static examples = [`<%= config.bin %> <%= command.id %>`];

  static flags = {
    skipSystemCheck: Flags.boolean({ description: 'Skip system check' }),
  };

  static args = {
    path: Args.string({ description: 'Directory name where to initialize project', required: true }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Init);

    let systemCheck = true;
    if (flags.skipSystemCheck) {
      this.log('System check skipped!');
    } else {
      try {
        systemCheck = await checkSystemReqs(this);
      } catch {
        systemCheck = false;
      }
    }

    if (!systemCheck) {
      this.error('System check failed! Check and install components from above list or use --skipSystemCheck flag');
      this.exit(1);
    }

    const path = await prepareInitDirectory(args.path);
    this.log(`Project will be initialized in directory: ${path}`);

    ux.action.start('Start cloning repository');
    const git: SimpleGit = simpleGit().clean(CleanOptions.FORCE);
    await git.clone(REPOSITORY_URL, path);
    await removeGit(path);
    ux.action.stop();

    this.log('Enjoy!');
  }
}
