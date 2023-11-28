import * as fs from 'node:fs/promises';
import { join } from 'node:path';

import { Command, ux } from '@oclif/core';

import { BaseCommand } from '../base.command';
import { readEnvFile } from './dirs';

type EnvVarConfig = {
  name: string;
  defaultValue?: string;
  alternativeNames?: string[];
};

type EnvSectionConfig = {
  description?: string;
  keys: EnvVarConfig[];
};

type EnvTemplateConfig = Record<string, EnvSectionConfig>;

export const envPromptConfig: EnvTemplateConfig = {
  main: {
    keys: [
      {
        name: 'PROJECT_NAME',
        defaultValue: 'saas',
      },
    ],
  },
  social: {
    description: 'Configure you social OAuth clients (optional):',
    keys: [
      { name: 'SOCIAL_AUTH_GOOGLE_OAUTH2_KEY' },
      {
        name: 'SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET',
      },
      {
        name: 'SOCIAL_AUTH_FACEBOOK_KEY',
      },
      {
        name: 'SOCIAL_AUTH_FACEBOOK_SECRET',
      },
    ],
  },
  stripe: {
    description: 'Configure Stripe access (optional):',
    keys: [
      { name: 'STRIPE_LIVE_SECRET_KEY' },
      {
        name: 'STRIPE_TEST_SECRET_KEY',
      },
      {
        name: 'DJSTRIPE_WEBHOOK_SECRET',
      },
      {
        name: 'STRIPE_PUBLISHABLE_KEY',
        alternativeNames: ['VITE_STRIPE_PUBLISHABLE_KEY'],
      },
    ],
  },
  contentful: {
    description: 'Configure Contentful access (optional):',
    keys: [
      { name: 'CONTENTFUL_SPACE_ID', alternativeNames: ['VITE_CONTENTFUL_SPACE'] },
      {
        name: 'CONTENTFUL_ACCESS_TOKEN',
        alternativeNames: ['VITE_CONTENTFUL_TOKEN'],
      },
      {
        name: 'CONTENTFUL_ENVIRONMENT',
        alternativeNames: ['VITE_CONTENTFUL_ENV'],
      },
    ],
  },
};

export abstract class EnvLoaderStorage {
  protected static ENV_SHARED_FILE = '.env.shared';
  protected static ENV_FILE = '.env';
  protected static PACKAGE_DIR = 'packages';

  protected PACKAGE_NAME = '';
  protected projectPath = '';

  abstract getEnvKeys(): Array<string>;

  async load(projectPath: string, ui: EnvLoaderUI): Promise<void> {
    this.projectPath = projectPath;

    const envsSharedContent = await this.getSharedEnvsContent();

    const envsContent = await this.readUserPrompt(envsSharedContent.toString(), ui);
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
      return join(projectPath, EnvLoaderStorage.PACKAGE_DIR, this.PACKAGE_NAME, EnvLoaderStorage.ENV_SHARED_FILE);
    }

    return join(projectPath, EnvLoaderStorage.ENV_SHARED_FILE);
  }

  protected async readUserPrompt(content: string, ui: EnvLoaderUI): Promise<string> {
    let ct = content;

    for (const key of this.getEnvKeys()) {
      const value = ui.getValue(key) ?? '<CHANGE_ME>';
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
      return join(projectPath, EnvLoaderStorage.PACKAGE_DIR, this.PACKAGE_NAME, EnvLoaderStorage.ENV_FILE);
    }

    return join(projectPath, EnvLoaderStorage.ENV_FILE);
  }
}

export class RootEnvLoaderStorage extends EnvLoaderStorage {
  getEnvKeys(): Array<string> {
    return ['PROJECT_NAME'];
  }
}

export class BackendEnvLoaderStorage extends EnvLoaderStorage {
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
export class ContentfulEnvLoaderStorage extends EnvLoaderStorage {
  protected PACKAGE_NAME = 'contentful';

  getEnvKeys(): Array<string> {
    return ['CONTENTFUL_SPACE_ID', 'CONTENTFUL_ACCESS_TOKEN', 'CONTENTFUL_ENVIRONMENT'];
  }
}

export class WorkersEnvLoaderStorage extends EnvLoaderStorage {
  protected PACKAGE_NAME = 'workers';

  getEnvKeys(): Array<string> {
    return ['CONTENTFUL_SPACE_ID', 'CONTENTFUL_ACCESS_TOKEN', 'CONTENTFUL_ENVIRONMENT'];
  }
}

export class WebappEnvLoaderStorage extends EnvLoaderStorage {
  protected PACKAGE_NAME = 'webapp';

  getEnvKeys(): Array<string> {
    return ['VITE_CONTENTFUL_SPACE', 'VITE_CONTENTFUL_TOKEN', 'VITE_STRIPE_PUBLISHABLE_KEY'];
  }
}

export class EnvLoaderUI {
  protected envs: Record<string, string> = {};

  // eslint-disable-next-line no-useless-constructor
  constructor(
    protected command?: BaseCommand<typeof Command>,
    protected promptConfig: EnvTemplateConfig = envPromptConfig
  ) {}

  async load() {
    // eslint-disable-next-line guard-for-in
    for (const sectionKey in this.promptConfig) {
      const envSection = this.promptConfig[sectionKey];
      if (envSection.description) this.command?.log(envSection.description);

      for (const envVarC of envSection.keys) {
        const defaultValue = envVarC.defaultValue ?? '<CHANGE_ME>';
        // eslint-disable-next-line no-await-in-loop
        const value = await ux.prompt(`Pass ${envVarC.name}`, { required: false, default: defaultValue });
        this.envs[envVarC.name] = value;
      }
    }
  }

  getValue(name: string) {
    const v = this.envs[name] ?? null;
    if (v !== null) {
      return v;
    }

    // look for alternative name
    // eslint-disable-next-line guard-for-in
    for (const sectionKey in this.promptConfig) {
      const envSection = this.promptConfig[sectionKey];
      for (const envVarC of envSection.keys) {
        if (envVarC.alternativeNames?.length && envVarC.alternativeNames.includes(name)) {
          return this.envs[envVarC.name];
        }
      }
    }

    return null;
  }
}
