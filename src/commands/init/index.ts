import { Args, Command, Flags, ux } from '@oclif/core';
import { CleanOptions, SimpleGit, simpleGit } from 'simple-git';

import { PROJECT_NAME, REPOSITORY_URL } from '../../config';
import { prepareInitDirectory, removeGit } from '../../utils/dirs';
import { BackendEnvLoader, EnvLoader, RootEnvLoader, WebappEnvLoader, WorkersEnvLoader } from '../../utils/env-loader';
import { checkSystemReqs } from '../../utils/system-check';

export default class Init extends Command {
  static description = `Initialize new ${PROJECT_NAME} project`;

  static examples = [`<%= config.bin %> <%= command.id %>`];

  static flags = {
    skipSystemCheck: Flags.boolean({ description: 'Skip system check' }),
  };

  static args = {
    path: Args.string({ description: 'Directory name where to initialize project', required: true, default: '.' }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Init);

    if (flags.skipSystemCheck) {
      this.log('System check skipped!');
    } else {
      await this.runSystemCheck();
    }

    const cloneDir = await prepareInitDirectory(args.path);
    this.log(`Project will be initialized in directory: ${cloneDir}`);

    await this.cloneProject(cloneDir);
    await this.loadEnvs(cloneDir);

    this.log('Enjoy!');
    this.exit();
  }

  private async runSystemCheck(): Promise<void> {
    let systemCheck;

    try {
      systemCheck = await checkSystemReqs(this);
    } catch {
      systemCheck = false;
    }

    if (!systemCheck) {
      this.error('System check failed! Check and install components from above list or use --skipSystemCheck flag');
      this.exit(1);
    }
  }

  private async cloneProject(cloneDir: string): Promise<void> {
    ux.action.start('Start cloning repository');

    const git: SimpleGit = simpleGit().clean(CleanOptions.FORCE);
    await git.clone(REPOSITORY_URL, cloneDir);
    await removeGit(cloneDir);

    ux.action.stop();
  }

  private async loadEnvs(projectPath: string): Promise<void> {
    ux.action.start('Setup env variables');

    const envLoaders: Array<EnvLoader> = [
      new RootEnvLoader(),
      new BackendEnvLoader(),
      new WorkersEnvLoader(),
      new WebappEnvLoader(),
    ];

    for (const loader of envLoaders) {
      await loader.load(projectPath); // eslint-disable-line no-await-in-loop
    }

    ux.action.stop();
  }
}
