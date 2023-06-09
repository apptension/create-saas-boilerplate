import fs from 'node:fs';
import { join } from 'node:path';

import { ux } from '@oclif/core';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';

import * as dirsUtils from '../../../src/utils/dirs';
import { RootEnvLoader } from '../../../src/utils/env-loader';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('RootEnvLoader', () => {
  const workersEnvLoader = new RootEnvLoader();
  let promptStub: sinon.SinonStub;
  let writeFileStub: sinon.SinonStub;
  let readEnvFileMock: sinon.SinonStub;

  beforeEach(() => {
    promptStub = sinon.stub(ux, 'prompt');
    writeFileStub = sinon.stub(fs.promises, 'writeFile');
    readEnvFileMock = sinon.stub(dirsUtils, 'readEnvFile').resolves(Buffer.from('PROJECT_NAME=saas'));
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should load root default envs', async () => {
    await workersEnvLoader.load('path');
    sinon.assert.calledOnceWithExactly(readEnvFileMock, join('path', '.env.shared'), true);
  });

  it('should save env value from prompt', async () => {
    promptStub.resolves('test_env');
    const expectedContent = 'PROJECT_NAME=test_env';

    await workersEnvLoader.load('path');

    sinon.assert.calledOnceWithExactly(writeFileStub, join('path', '.env'), expectedContent);
  });

  it('should raise error if no default envs found', async () => {
    readEnvFileMock.resolves(null);
    expect(workersEnvLoader.load('path')).to.be.rejectedWith(new Error('No env content found'));
  });
});
