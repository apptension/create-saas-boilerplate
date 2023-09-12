import { Hook } from '@oclif/core';

import { provider } from '../../utils/telemetry';

const telemetryHook: Hook<'init'> = async function (options) {
  console.log(`example init hook running before ${options.id}`);
  provider.register();
  console.log('Telemetry registered');
};

export default telemetryHook;
