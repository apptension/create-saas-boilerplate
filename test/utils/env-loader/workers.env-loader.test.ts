import fs from 'node:fs';
import { join } from 'node:path';

import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';

import * as dirsUtils from '../../../src/utils/dirs';
import { EnvLoaderUI, WorkersEnvLoaderStorage } from '../../../src/utils/env-loader';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('WorkersEnvLoader', () => {
  const workersEnvLoader = new WorkersEnvLoaderStorage();
  let writeFileStub: sinon.SinonStub;
  let readEnvFileMock: sinon.SinonStub;

  beforeEach(() => {
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
    const ui = new EnvLoaderUI();
    await workersEnvLoader.load('path', ui);
    sinon.assert.calledOnceWithExactly(readEnvFileMock, join('path', 'packages', 'workers', '.env.shared'), true);
  });

  it('should save env value from prompt', async () => {
    const ui = new EnvLoaderUI();
    const stub = sinon.stub(ui, 'getValue');
    stub.returns('test_env');
    const expectedContent =
      'CONTENTFUL_SPACE_ID=test_env\nCONTENTFUL_ACCESS_TOKEN=test_env\nCONTENTFUL_ENVIRONMENT=test_env';

    await workersEnvLoader.load('path', ui);

    sinon.assert.calledOnceWithExactly(writeFileStub, join('path', 'packages', 'workers', '.env'), expectedContent);
  });

  it('should raise error if no default envs found', async () => {
    const ui = new EnvLoaderUI();
    const stub = sinon.stub(ui, 'getValue');
    stub.returns(null);
    expect(workersEnvLoader.load('path', ui)).to.be.rejectedWith(new Error('No env content found'));
  });
});
