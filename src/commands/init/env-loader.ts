import * as fs from 'node:fs/promises';
import { join } from 'node:path';

import { ux } from '@oclif/core';

import { parseEnvFile, readEnvFile } from '../../utils/dirs';

export abstract class EnvLoader {
  protected static ENV_SHARED_FILE = '.env.shared';
  protected static ENV_FILE = '.env';
  protected static PACKAGE_DIR = 'packages';

  protected PACKAGE_NAME = '';
  protected projectPath = '';

  abstract getEnvKeys(): Array<string>;

  async load(projectPath: string): Promise<void> {
    this.projectPath = projectPath;

    const envsSharedContent = await this.getSharedEnvsContent();
    const envsShared = parseEnvFile(envsSharedContent);

    const envsContent = await this.readUserPrompt(envsSharedContent.toString(), envsShared);
    await this.writeEnvFile(envsContent);
  }

  async getSharedEnvsContent(): Promise<Buffer> {
    const sharedEnvsFilePath = this.getSharedEnvsFilePath(this.projectPath);
    const sharedEnvsContent = await readEnvFile(sharedEnvsFilePath, true);

    if (!sharedEnvsContent) {
      throw new Error('No env content found');
    }

    return sharedEnvsContent;
  }

  protected getSharedEnvsFilePath(projectPath: string): string {
    if (this.PACKAGE_NAME) {
      return join(projectPath, EnvLoader.PACKAGE_DIR, this.PACKAGE_NAME, EnvLoader.ENV_SHARED_FILE);
    }

    return join(projectPath, EnvLoader.ENV_SHARED_FILE);
  }

  protected async readUserPrompt(content: string, defaultEnvs: Record<string, unknown>): Promise<string> {
    let ct = content;

    for (const key of this.getEnvKeys()) {
      const defaultValue = (defaultEnvs[key] as string) ?? '<CHANGE_ME>';
      // eslint-disable-next-line no-await-in-loop
      const value = await ux.prompt(`Pass ${key}`, { required: false, default: defaultValue });
      ct = ct.replace(new RegExp(`${key}=.+`, 'g'), `${key}=${value}`);
    }

    return ct;
  }

  protected async writeEnvFile(content: string): Promise<void> {
    const envsFilePath = this.getEnvsFilePath(this.projectPath);
    await fs.writeFile(envsFilePath, content);
  }

  protected getEnvsFilePath(projectPath: string): string {
    if (this.PACKAGE_NAME) {
      return join(projectPath, EnvLoader.PACKAGE_DIR, this.PACKAGE_NAME, EnvLoader.ENV_FILE);
    }

    return join(projectPath, EnvLoader.ENV_FILE);
  }
}

export class RootEnvLoader extends EnvLoader {
  getEnvKeys(): Array<string> {
    return ['PROJECT_NAME'];
  }
}

export class BackendEnvLoader extends EnvLoader {
  protected PACKAGE_NAME = 'backend';

  getEnvKeys(): Array<string> {
    return [
      'SOCIAL_AUTH_GOOGLE_OAUTH2_KEY',
      'SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET',
      'SOCIAL_AUTH_FACEBOOK_KEY',
      'SOCIAL_AUTH_FACEBOOK_SECRET',
      'STRIPE_LIVE_SECRET_KEY',
      'STRIPE_TEST_SECRET_KEY',
      'DJSTRIPE_WEBHOOK_SECRET',
    ];
  }
}

export class WorkersEnvLoader extends EnvLoader {
  protected PACKAGE_NAME = 'workers';

  getEnvKeys(): Array<string> {
    return ['CONTENTFUL_SPACE_ID', 'CONTENTFUL_ACCESS_TOKEN', 'CONTENTFUL_ENVIRONMENT'];
  }
}

export class WebappEnvLoader extends EnvLoader {
  protected PACKAGE_NAME = 'webapp';

  getEnvKeys(): Array<string> {
    return ['VITE_CONTENTFUL_SPACE', 'VITE_CONTENTFUL_TOKEN', 'VITE_STRIPE_PUBLISHABLE_KEY'];
  }
}
