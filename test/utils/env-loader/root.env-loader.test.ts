import fs from 'node:fs';
import { join } from 'node:path';

import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';

import * as dirsUtils from '../../../src/utils/dirs';
import { EnvLoaderUI, RootEnvLoaderStorage } from '../../../src/utils/env-loader';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('RootEnvLoader', () => {
  const workersEnvLoader = new RootEnvLoaderStorage();
  let writeFileStub: sinon.SinonStub;
  let readEnvFileMock: sinon.SinonStub;

  beforeEach(() => {
    writeFileStub = sinon.stub(fs.promises, 'writeFile');
    readEnvFileMock = sinon.stub(dirsUtils, 'readEnvFile').resolves(Buffer.from('PROJECT_NAME=saas'));
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should load root default envs', async () => {
    const ui = new EnvLoaderUI();
    await workersEnvLoader.load('path', ui);
    sinon.assert.calledOnceWithExactly(readEnvFileMock, join('path', '.env.shared'), true);
  });

  it('should save env value from prompt', async () => {
    const ui = new EnvLoaderUI();
    const stub = sinon.stub(ui, 'getValue');
    stub.returns('test_env');
    const expectedContent = 'PROJECT_NAME=test_env';

    await workersEnvLoader.load('path', ui);

    sinon.assert.calledOnceWithExactly(writeFileStub, join('path', '.env'), expectedContent);
  });

  it('should raise error if no default envs found', async () => {
    readEnvFileMock.resolves(null);
    const ui = new EnvLoaderUI();
    const stub = sinon.stub(ui, 'getValue');
    stub.returns(null);
    expect(workersEnvLoader.load('path', ui)).to.be.rejectedWith(new Error('No env content found'));
  });
});
