import childProcess from 'node:child_process';
import fs from 'node:fs';
import { PassThrough } from 'node:stream';

import { ux } from '@oclif/core';
import { test } from '@oclif/test';
import { RequestInfo, Response } from 'node-fetch';
import * as fetchModule from 'node-fetch';
import * as simpleGit from 'simple-git';
import { SimpleGit } from 'simple-git';
import * as sinon from 'sinon';
import tar from 'tar';

import { GH_REPO_NAME, GH_REPO_OWNER } from '../../../src/config';
import * as dirsUtils from '../../../src/utils/dirs';
import {
  BackendEnvLoaderStorage,
  ContentfulEnvLoaderStorage,
  RootEnvLoaderStorage,
  WebappEnvLoaderStorage,
  WorkersEnvLoaderStorage,
} from '../../../src/utils/env-loader';
import * as systemCheck from '../../../src/utils/system-check';

describe('init', () => {
  let backendEnvLoaderStub: sinon.SinonStub;
  let contentfulEnvLoaderStub: sinon.SinonStub;
  let rootEnvLoaderStub: sinon.SinonStub;
  let workersEnvLoaderStub: sinon.SinonStub;
  let webappEnvLoaderStub: sinon.SinonStub;

  let simpleGitStub: sinon.SinonStub;
  let fetchStub: sinon.SinonStub;
  let tarExtractStub: sinon.SinonStub;
  let childProcessStub: sinon.SinonStub;

  const tagName = '1.0.0';
  const tarballUrl = 'url:tarball';

  beforeEach(() => {
    sinon.stub(ux, 'prompt');
    sinon.stub(fs.promises, 'writeFile');
    sinon.stub(dirsUtils, 'removeGit');
    sinon.stub(dirsUtils, 'prepareInitDirectory').resolves('/path');

    simpleGitStub = sinon.stub(simpleGit, 'simpleGit').callsFake(() => {
      return {
        init: () => Promise.resolve(),
      } as unknown as SimpleGit;
    });

    const releaseResponse = new Response(
      JSON.stringify({
        // eslint-disable-next-line camelcase
        tag_name: tagName,
        // eslint-disable-next-line camelcase
        tarball_url: tarballUrl,
      }),
      { status: 200 }
    );
    const tarballResponse = new Response('file_body', { status: 200 });
    fetchStub = sinon.stub(fetchModule, 'default').callsFake((url: RequestInfo) => {
      return Promise.resolve((url as string).includes('api.github.com') ? releaseResponse : tarballResponse);
    });

    tarExtractStub = sinon.stub(tar, 'extract').callsFake(() => new PassThrough().end().destroy());

    backendEnvLoaderStub = sinon
      .stub(BackendEnvLoaderStorage.prototype, 'getSharedEnvsContent')
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
      .stub(RootEnvLoaderStorage.prototype, 'getSharedEnvsContent')
      .callsFake(async () => Buffer.from('PROJECT_NAME=saas\n'));

    workersEnvLoaderStub = sinon
      .stub(WorkersEnvLoaderStorage.prototype, 'getSharedEnvsContent')
      .callsFake(async () =>
        Buffer.from(
          'CONTENTFUL_SPACE_ID=<CHANGE_ME>\n' +
            'CONTENTFUL_ACCESS_TOKEN=<CHANGE_ME>\n' +
            'CONTENTFUL_ENVIRONMENT=<CHANGE_ME>'
        )
      );

    contentfulEnvLoaderStub = sinon
      .stub(ContentfulEnvLoaderStorage.prototype, 'getSharedEnvsContent')
      .callsFake(async () =>
        Buffer.from(
          'CONTENTFUL_SPACE_ID=<CHANGE_ME>\n' +
            'CONTENTFUL_ACCESS_TOKEN=<CHANGE_ME>\n' +
            'CONTENTFUL_ENVIRONMENT=<CHANGE_ME>'
        )
      );

    webappEnvLoaderStub = sinon
      .stub(WebappEnvLoaderStorage.prototype, 'getSharedEnvsContent')
      .callsFake(async () =>
        Buffer.from(
          'VITE_CONTENTFUL_SPACE=<CHANGE_ME>\n' +
            'VITE_CONTENTFUL_TOKEN=<CHANGE_ME>\n' +
            'VITE_STRIPE_PUBLISHABLE_KEY=<CHANGE_ME>'
        )
      );

    childProcessStub = sinon.stub(childProcess, 'execSync').callsFake(() => '');
  });

  afterEach(() => {
    sinon.restore();
  });

  test
    .stub(systemCheck, 'checkSystemReqs', sinon.stub().resolves(true))
    .command(['init', 'path'])
    .exit(0)
    .it('clones git repository', () => {
      sinon.assert.calledOnceWithExactly(simpleGitStub, '/path');
    });

  test
    .stub(systemCheck, 'checkSystemReqs', sinon.stub().resolves(true))
    .command(['init', 'path'])
    .exit(0)
    .it('calls fetch for latest release tag', () => {
      sinon.assert.calledWith(
        fetchStub,
        `https://api.github.com/repos/${GH_REPO_OWNER}/${GH_REPO_NAME}/releases/latest`
      );
    });

  test
    .stub(systemCheck, 'checkSystemReqs', sinon.stub().resolves(true))
    .command(['init', 'path'])
    .exit(0)
    .it('calls fetch tarball and save it to cloneDir', () => {
      sinon.assert.calledWith(fetchStub, tarballUrl);
      sinon.assert.calledWith(tarExtractStub, { cwd: '/path', strip: 1 });
    });

  test
    .stub(systemCheck, 'checkSystemReqs', sinon.stub().resolves(true))
    .command(['init', 'path'])
    .exit(0)
    .it('clones git repository', () => {
      sinon.assert.calledOnceWithExactly(childProcessStub, 'pnpm i --frozen-lockfile', {
        cwd: '/path',
        stdio: [0, 1, 2],
      });
    });

  test
    .stub(systemCheck, 'checkSystemReqs', sinon.stub().resolves(true))
    .command(['init', 'path'])
    .exit(0)
    .it('calls expected env loaders', () => {
      sinon.assert.calledOnceWithExactly(backendEnvLoaderStub);
      sinon.assert.calledOnceWithExactly(contentfulEnvLoaderStub);
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
