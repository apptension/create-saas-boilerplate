import fs from 'node:fs';

import { ux } from '@oclif/core';
import { test } from '@oclif/test';
import * as simpleGit from 'simple-git';
import { SimpleGit } from 'simple-git';
import * as sinon from 'sinon';

import * as dirsUtils from '../../../src/utils/dirs';
import { BackendEnvLoader, RootEnvLoader, WebappEnvLoader, WorkersEnvLoader } from '../../../src/utils/env-loader';
import * as systemCheck from '../../../src/utils/system-check';

describe('init', () => {
  let backendEnvLoaderStub: sinon.SinonStub;
  let rootEnvLoaderStub: sinon.SinonStub;
  let workersEnvLoaderStub: sinon.SinonStub;
  let webappEnvLoaderStub: sinon.SinonStub;

  let simpleGitStub: sinon.SinonStub;

  beforeEach(() => {
    sinon.stub(ux, 'prompt');
    sinon.stub(fs.promises, 'writeFile');
    sinon.stub(dirsUtils, 'removeGit');
    sinon.stub(dirsUtils, 'prepareInitDirectory').resolves('/path');

    simpleGitStub = sinon.stub(simpleGit, 'simpleGit').callsFake(() => {
      return {
        clean: () => {
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          return { clone: () => {} };
        },
      } as unknown as SimpleGit;
    });

    backendEnvLoaderStub = sinon
      .stub(BackendEnvLoader.prototype, 'getSharedEnvsContent')
      .callsFake(async () =>
        Buffer.from(
          'SOCIAL_AUTH_GOOGLE_OAUTH2_KEY=<CHANGE_ME>\n' +
            'SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET=<CHANGE_ME>\n' +
            'SOCIAL_AUTH_FACEBOOK_KEY=<CHANGE_ME>\n' +
            'SOCIAL_AUTH_FACEBOOK_SECRET=<CHANGE_ME>\n' +
            'STRIPE_LIVE_SECRET_KEY=<CHANGE_ME>\n' +
            'STRIPE_TEST_SECRET_KEY=<CHANGE_ME>\n' +
            'DJSTRIPE_WEBHOOK_SECRET=whsec_<CHANGE_ME>'
        )
      );

    rootEnvLoaderStub = sinon
      .stub(RootEnvLoader.prototype, 'getSharedEnvsContent')
      .callsFake(async () => Buffer.from('PROJECT_NAME=saas\n'));

    workersEnvLoaderStub = sinon
      .stub(WorkersEnvLoader.prototype, 'getSharedEnvsContent')
      .callsFake(async () =>
        Buffer.from(
          'CONTENTFUL_SPACE_ID=<CHANGE_ME>\n' +
            'CONTENTFUL_ACCESS_TOKEN=<CHANGE_ME>\n' +
            'CONTENTFUL_ENVIRONMENT=<CHANGE_ME>'
        )
      );

    webappEnvLoaderStub = sinon
      .stub(WebappEnvLoader.prototype, 'getSharedEnvsContent')
      .callsFake(async () =>
        Buffer.from(
          'VITE_CONTENTFUL_SPACE=<CHANGE_ME>\n' +
            'VITE_CONTENTFUL_TOKEN=<CHANGE_ME>\n' +
            'VITE_STRIPE_PUBLISHABLE_KEY=<CHANGE_ME>'
        )
      );
  });

  afterEach(() => {
    sinon.restore();
  });

  test
    .stub(systemCheck, 'checkSystemReqs', sinon.stub().resolves(true))
    .command(['init', 'path'])
    .exit(0)
    .it('clones git repository', () => {
      sinon.assert.calledOnceWithExactly(simpleGitStub);
    });

  test
    .stub(systemCheck, 'checkSystemReqs', sinon.stub().resolves(true))
    .command(['init', 'path'])
    .exit(0)
    .it('calls expected env loaders', () => {
      sinon.assert.calledOnceWithExactly(backendEnvLoaderStub);
      sinon.assert.calledOnceWithExactly(workersEnvLoaderStub);
      sinon.assert.calledOnceWithExactly(webappEnvLoaderStub);
      sinon.assert.calledOnceWithExactly(rootEnvLoaderStub);
    });

  test
    .stub(systemCheck, 'checkSystemReqs', sinon.stub().throws(new Error('Cmd is not installed')))
    .command(['init', 'path'])
    .exit(2)
    .it('exits with error code 2 if system check fails');
});
