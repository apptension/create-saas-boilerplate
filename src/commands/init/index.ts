import fetch from 'node-fetch';

import { Args, Command, Flags, ux } from '@oclif/core';
import { SimpleGit, simpleGit } from 'simple-git';

import { DOCS_URL, GH_REPO_NAME, GH_REPO_OWNER, LANDING_URL, PROJECT_NAME, REPOSITORY_URL } from '../../config';
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

    const releaseTag = await this.fetchLatestRelease();

    await this.cloneProject(cloneDir, releaseTag);
    await this.loadEnvs(cloneDir);

    const startAppMsg = this.getStartAppMessage();
    this.log(startAppMsg);

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

  private async fetchLatestRelease(): Promise<string> {
    ux.action.start('Fetching latest release');
    const response = await fetch(`https://api.github.com/repos/${GH_REPO_OWNER}/${GH_REPO_NAME}/releases/latest`);
    const release = await response.json();
    ux.action.stop();
    const tagName = release.tag_name;
    this.log(`Latest release: ${tagName}`);
    return tagName;
  }

  private async cloneProject(cloneDir: string, releaseTag: string): Promise<void> {
    ux.action.start('Start cloning repository');

    const git: SimpleGit = simpleGit();
    await git.clone(REPOSITORY_URL, cloneDir, ['-b', releaseTag, '--single-branch']);
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

  private getStartAppMessage(): string {
    return `
——————————————————————————————————————————————————————————————————————————————————————————————————————
Initialization completed! 🚀 To start the application, please refer to the following commands:

| \u001B[1mStart backend:\u001B[0m
|
| \u001B[34mnx run core:docker-compose:up\u001B[0m
|
| or a shorter version:
|
| \u001B[34mmake up\u001B[0m
|
| This will run docker containers for all the backend services in the detached mode.
|
| Backend is running on \u001B[34mhttp://localhost:5001\u001B[0m.
|
| Admin Panel is running on \u001B[34mhttp://admin.localhost:5001\u001B[0m.
|
| Mailcatcher is running on \u001B[34mhttp://localhost:1080\u001B[0m.
|
| \u001B[1mStart webapp:\u001B[0m
|
| \u001B[34mnx start webapp\u001B[0m
|
| Web app is running on \u001B[34mhttp://localhost:3000\u001B[0m.
|
| \u001B[1mStart documentation:\u001B[0m
|
| \u001B[34mnx start docs\u001B[0m
|
| Docs app is running on \u001B[34mhttp://localhost:3006\u001B[0m.

📖 Official documentation: ${DOCS_URL}
🌟 SaaS Boilerplate page: ${LANDING_URL}
——————————————————————————————————————————————————————————————————————————————————————————————————————
    `;
  }
}
