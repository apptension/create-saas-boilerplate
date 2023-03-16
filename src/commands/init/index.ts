import { Args, Command, ux } from '@oclif/core';
import { CleanOptions, SimpleGit, simpleGit } from 'simple-git';

import { PROJECT_NAME, REPOSITORY_URL } from '../../config';
import {prepareInitDirectory, removeGit} from '../../utils/dirs';

export default class Init extends Command {
  static description = `Initialize new ${PROJECT_NAME} project`;

  static examples = [`<%= config.bin %> <%= command.id %>`];

  static flags = {};

  static args = {
    path: Args.string({ description: 'Directory name where to initialize project', required: true }),
  };

  async run(): Promise<void> {
    const { args } = await this.parse(Init);

    const path = await prepareInitDirectory(args.path);
    this.log(`Project will be initialized in directory: ${path}`);

    ux.action.start('Start cloning repository...');
    const git: SimpleGit = simpleGit().clean(CleanOptions.FORCE);
    await git.clone(REPOSITORY_URL, path);
    await removeGit(path);
    ux.action.stop();

    this.log('Enjoy!');
  }
}
