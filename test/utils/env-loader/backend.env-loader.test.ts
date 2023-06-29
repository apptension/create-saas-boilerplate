import fs from 'node:fs';
import { join } from 'node:path';

import { ux } from '@oclif/core';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';

import * as dirsUtils from '../../../src/utils/dirs';
import { BackendEnvLoader } from '../../../src/utils/env-loader';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('BackendEnvLoader', () => {
  const backendEnvLoader = new BackendEnvLoader();
  let promptStub: sinon.SinonStub;
  let writeFileStub: sinon.SinonStub;
  let readEnvFileMock: sinon.SinonStub;

  beforeEach(() => {
    promptStub = sinon.stub(ux, 'prompt');
    writeFileStub = sinon.stub(fs.promises, 'writeFile');
    readEnvFileMock = sinon
      .stub(dirsUtils, 'readEnvFile')
      .resolves(
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
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should load backend package default envs', async () => {
    await backendEnvLoader.load('path');
    sinon.assert.calledOnceWithExactly(readEnvFileMock, join('path', 'packages', 'backend', '.env.shared'), true);
  });

  it('should save env value from prompt', async () => {
    promptStub.resolves('test_env');
    const expectedContent =
      'SOCIAL_AUTH_GOOGLE_OAUTH2_KEY=test_env\n' +
      'SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET=test_env\n' +
      'SOCIAL_AUTH_FACEBOOK_KEY=test_env\n' +
      'SOCIAL_AUTH_FACEBOOK_SECRET=test_env\n' +
      'STRIPE_LIVE_SECRET_KEY=test_env\n' +
      'STRIPE_TEST_SECRET_KEY=test_env\n' +
      'DJSTRIPE_WEBHOOK_SECRET=test_env';

    await backendEnvLoader.load('path');

    sinon.assert.calledOnceWithExactly(writeFileStub, join('path', 'packages', 'backend', '.env'), expectedContent);
  });

  it('should raise error if no default envs found', async () => {
    readEnvFileMock.resolves(null);
    expect(backendEnvLoader.load('path')).to.be.rejectedWith(new Error('No env content found'));
  });
});
