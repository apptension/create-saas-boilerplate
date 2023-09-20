import { Hook } from '@oclif/core';

import { SB_TELEMETRY_DISABLED } from '../../config';
import { provider } from '../../utils/telemetry';

const telemetryHook: Hook<'init'> = async function () {
  if (!SB_TELEMETRY_DISABLED) {
    provider.register();
  }
};

export default telemetryHook;
