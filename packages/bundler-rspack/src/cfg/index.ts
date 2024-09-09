import { ConfigurationInstance } from '@dz-web/esboot';
import { Environment } from '@dz-web/esboot-common';

// Partials
import { addEntry } from './partials/add-entry';
import { addOutput } from './partials/add-output';
import { addResolve } from './partials/add-resolve';
import { addDevtool } from './partials/add-devtool';

import { addDevServer } from './add-dev-server';
import { customConfig } from './custom-config';

import type { CustomRspackConfiguration } from './types';

export const getRspackCfg = async (
  cfg: ConfigurationInstance
): Promise<CustomRspackConfiguration> => {
  const { isDev } = cfg.config;

  const rspackCfg: CustomRspackConfiguration = {
    mode: isDev ? Environment.dev : Environment.prod,
    performance: {
      hints: isDev ? false : 'warning',
    },
    entry: {},
    plugins: [],
    devServer: {},
    module: {
      rules: [],
    },
  };

  // Partial
  await addEntry(cfg, rspackCfg);
  await addOutput(cfg, rspackCfg);
  await addResolve(cfg, rspackCfg);
  await addDevtool(cfg, rspackCfg);

  await addDevServer(cfg, rspackCfg);
  await customConfig(cfg, rspackCfg);

  return rspackCfg;
};
