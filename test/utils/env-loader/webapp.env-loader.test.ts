import fs from 'node:fs';
import { join } from 'node:path';

import { ux } from '@oclif/core';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';

import * as dirsUtils from '../../../src/utils/dirs';
import { WebappEnvLoader } from '../../../src/utils/env-loader';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('WebappEnvLoader', () => {
  const webappEnvLoader = new WebappEnvLoader();
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
          'VITE_CONTENTFUL_SPACE=<CHANGE_ME>\n' +
            'VITE_CONTENTFUL_TOKEN=<CHANGE_ME>\n' +
            'VITE_STRIPE_PUBLISHABLE_KEY=<CHANGE_ME>'
        )
      );
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should load webapp package default envs', async () => {
    await webappEnvLoader.load('path');
    sinon.assert.calledOnceWithExactly(readEnvFileMock, join('path', 'packages', 'webapp', '.env.shared'), true);
  });

  it('should save env value from prompt', async () => {
    promptStub.resolves('test_env');
    const expectedContent =
      'VITE_CONTENTFUL_SPACE=test_env\nVITE_CONTENTFUL_TOKEN=test_env\nVITE_STRIPE_PUBLISHABLE_KEY=test_env';

    await webappEnvLoader.load('path');

    sinon.assert.calledOnceWithExactly(writeFileStub, join('path', 'packages', 'webapp', '.env'), expectedContent);
  });

  it('should raise error if no default envs found', async () => {
    readEnvFileMock.resolves(null);
    expect(webappEnvLoader.load('path')).to.be.rejectedWith(new Error('No env content found'));
  });
});
