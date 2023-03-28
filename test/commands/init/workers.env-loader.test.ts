import fs from 'node:fs';

import { ux } from '@oclif/core';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { WorkersEnvLoader } from '../../../src/commands/init/env-loader';
import * as dirsUtils from '../../../src/utils/dirs';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('WorkersEnvLoader', () => {
  const workersEnvLoader = new WorkersEnvLoader();
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
          'CONTENTFUL_SPACE_ID=<CHANGE_ME>\n' +
            'CONTENTFUL_ACCESS_TOKEN=<CHANGE_ME>\n' +
            'CONTENTFUL_ENVIRONMENT=<CHANGE_ME>'
        )
      );
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should load workers package default envs', async () => {
    await workersEnvLoader.load('path');
    sinon.assert.calledOnceWithExactly(readEnvFileMock, 'path/packages/workers/.env.shared', true);
  });

  it('should save env value from prompt', async () => {
    promptStub.resolves('test_env');
    const expectedContent =
      'CONTENTFUL_SPACE_ID=test_env\nCONTENTFUL_ACCESS_TOKEN=test_env\nCONTENTFUL_ENVIRONMENT=test_env';

    await workersEnvLoader.load('path');

    sinon.assert.calledOnceWithExactly(writeFileStub, 'path/packages/workers/.env', expectedContent);
  });

  it('should raise error if no default envs found', async () => {
    readEnvFileMock.resolves(null);
    expect(workersEnvLoader.load('path')).to.be.rejectedWith(new Error('No env content found'));
  });
});
