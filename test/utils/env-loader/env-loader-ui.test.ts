import { ux } from '@oclif/core';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { EnvLoaderUI } from '../../../src/utils/env-loader';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('EnvLoaderUI', () => {
  let promptStub: sinon.SinonStub;

  beforeEach(() => {
    promptStub = sinon.stub(ux, 'prompt');
  });

  afterEach(() => {
    sinon.restore();
  });

  const ENV_TEST_NAME = 'PROJECT_NAME';
  const ENV_TEST_VALUE = 'test_value';

  it('should call prompt with the default value', async () => {
    const ui = new EnvLoaderUI(undefined, {
      main: {
        keys: [
          {
            name: ENV_TEST_NAME,
            defaultValue: 'saas',
          },
        ],
      },
    });
    promptStub.resolves(ENV_TEST_VALUE);
    await ui.load();
    expect(ui.getValue(ENV_TEST_NAME)).to.eqls(ENV_TEST_VALUE);
    sinon.assert.calledOnceWithExactly(promptStub, `Pass PROJECT_NAME`, { required: false, default: 'saas' });
  });

  it('should call prompt without the default value', async () => {
    const ui = new EnvLoaderUI(undefined, {
      main: {
        keys: [
          {
            name: ENV_TEST_NAME,
          },
        ],
      },
    });
    promptStub.resolves(ENV_TEST_VALUE);
    await ui.load();
    expect(ui.getValue(ENV_TEST_NAME)).to.eqls(ENV_TEST_VALUE);
    sinon.assert.calledOnceWithExactly(promptStub, `Pass ${ENV_TEST_NAME}`, {
      required: false,
      default: '<CHANGE_ME>',
    });
  });
});
