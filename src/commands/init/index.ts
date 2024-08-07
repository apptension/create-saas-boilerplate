import * as childProcess from 'node:child_process';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';

import { Args, Flags, ux } from '@oclif/core';
import fetch from 'node-fetch';
import { SimpleGit, simpleGit } from 'simple-git';
import tar from 'tar';

import { BaseCommand } from '../../base.command';
import {
  DISCORD_URL,
  DOCS_URL,
  GH_REPO_NAME,
  GH_REPO_OWNER,
  GITHUB_REPOSITORY,
  LANDING_URL,
  PROJECT_NAME,
} from '../../config';
import { prepareInitDirectory, removeGit } from '../../utils/dirs';
import {
  BackendEnvLoaderStorage,
  ContentfulEnvLoaderStorage,
  EnvLoaderStorage,
  EnvLoaderUI,
  RootEnvLoaderStorage,
  WebappEnvLoaderStorage,
  WorkersEnvLoaderStorage,
} from '../../utils/env-loader';
import { checkSystemReqs } from '../../utils/system-check';

export default class Init extends BaseCommand<typeof Init> {
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

    if (flags.skipSystemCheck) {
      this.log('System check skipped!');
      this.span?.addEvent('System check skipped');
    } else {
      await this.runSystemCheck();
      this.span?.addEvent('System check passed');
    }

    const cloneDir = await prepareInitDirectory(args.path);
    this.log(`Project will be initialized in directory: ${cloneDir}`);

    const latestRelease = await this.fetchLatestRelease();

    await this.downloadProject(cloneDir, latestRelease.tarballUrl);
    this.span?.addEvent('Project downloaded');
    await this.loadEnvs(cloneDir);
    this.span?.addEvent('Envs set');
    await this.installDeps(cloneDir);
    this.span?.addEvent('Dependencies installed');

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

  private async fetchLatestRelease(): Promise<{ tagName: string; tarballUrl: string }> {
    ux.action.start('Fetching latest release');
    const response = await fetch(`https://api.github.com/repos/${GH_REPO_OWNER}/${GH_REPO_NAME}/releases/latest`);
    const release = (await response.json()) as any;
    ux.action.stop();
    const tagName = release.tag_name;
    this.log(`Latest release: ${tagName}`);
    return {
      tagName,
      tarballUrl: release.tarball_url,
    };
  }

  private async downloadProject(cloneDir: string, tarballUrl: string): Promise<void> {
    ux.action.start('Downloading project');

    const res = await fetch(tarballUrl);

    await finished(
      Readable.from(res.body).pipe(
        tar.extract({
          cwd: cloneDir,
          strip: 1,
        })
      )
    );

    const git: SimpleGit = simpleGit(cloneDir);
    await removeGit(cloneDir);
    await git.init();

    ux.action.stop();
  }

  private async loadEnvs(projectPath: string): Promise<void> {
    this.log(`Setup environment variables:
This step will set up all environment variables.
For more details visit: \u001B[34mhttps://docs.demo.saas.apptoku.com/api-reference/env\u001B[0m.\n`);

    const envLoaders: Array<EnvLoaderStorage> = [
      new RootEnvLoaderStorage(),
      new BackendEnvLoaderStorage(),
      new ContentfulEnvLoaderStorage(),
      new WorkersEnvLoaderStorage(),
      new WebappEnvLoaderStorage(),
    ];

    const loaderUI = new EnvLoaderUI(this);
    await loaderUI.load();

    for (const loader of envLoaders) {
      await loader.load(projectPath, loaderUI); // eslint-disable-line no-await-in-loop
    }
  }

  private async installDeps(cloneDir: string): Promise<void> {
    ux.action.start('Installing dependencies');
    childProcess.execSync('pnpm i --frozen-lockfile', { cwd: cloneDir, stdio: [0, 1, 2] });
    ux.action.stop();
  }

  private getStartAppMessage(): string {
    return `
——————————————————————————————————————————————————————————————————————————————————————————————————————
Initialization completed! 🚀 To start the application, please refer to the following commands:

| \u001B[1mStart both: backend and webapp:\u001B[0m
|
| \u001B[34mpnpm saas up\u001B[0m
|
| \u001B[1mStart backend:\u001B[0m
|
| \u001B[34mpnpm saas backend up\u001B[0m
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
| \u001B[34mpnpm saas webapp up\u001B[0m
|
| Web app is running on \u001B[34mhttp://localhost:3000\u001B[0m.
|
| \u001B[1mStart documentation:\u001B[0m
|
| \u001B[34mpnpm saas docs up\u001B[0m
|
| Docs app is running on \u001B[34mhttp://localhost:3006\u001B[0m.

📖 Official documentation: ${DOCS_URL}
🌟 SaaS Boilerplate page: ${LANDING_URL}
🔗 Main repository: ${GITHUB_REPOSITORY}
📣 Discord server: ${DISCORD_URL}
——————————————————————————————————————————————————————————————————————————————————————————————————————
    `;
  }
}
