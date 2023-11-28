import fs from 'node:fs';
import { join } from 'node:path';

import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';

import * as dirsUtils from '../../../src/utils/dirs';
import { BackendEnvLoaderStorage, EnvLoaderUI } from '../../../src/utils/env-loader';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('BackendEnvLoader', () => {
  const backendEnvLoader = new BackendEnvLoaderStorage();
  let writeFileStub: sinon.SinonStub;
  let readEnvFileMock: sinon.SinonStub;

  beforeEach(() => {
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
    const ui = new EnvLoaderUI();
    await backendEnvLoader.load('path', ui);
    sinon.assert.calledOnceWithExactly(readEnvFileMock, join('path', 'packages', 'backend', '.env.shared'), true);
  });

  it('should save env value from prompt', async () => {
    const ui = new EnvLoaderUI();
    const stub = sinon.stub(ui, 'getValue');
    stub.returns('test_env');
    const expectedContent =
      'SOCIAL_AUTH_GOOGLE_OAUTH2_KEY=test_env\n' +
      'SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET=test_env\n' +
      'SOCIAL_AUTH_FACEBOOK_KEY=test_env\n' +
      'SOCIAL_AUTH_FACEBOOK_SECRET=test_env\n' +
      'STRIPE_LIVE_SECRET_KEY=test_env\n' +
      'STRIPE_TEST_SECRET_KEY=test_env\n' +
      'DJSTRIPE_WEBHOOK_SECRET=test_env';

    await backendEnvLoader.load('path', ui);

    sinon.assert.calledOnceWithExactly(writeFileStub, join('path', 'packages', 'backend', '.env'), expectedContent);
  });

  it('should raise error if no default envs found', async () => {
    const ui = new EnvLoaderUI();
    const stub = sinon.stub(ui, 'getValue');
    stub.returns(null);
    readEnvFileMock.resolves(null);
    expect(backendEnvLoader.load('path', ui)).to.be.rejectedWith(new Error('No env content found'));
  });
});
