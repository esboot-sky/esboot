import { EnvironmentPlugin, DefinePlugin } from '@rspack/core';
import { addDefine } from '@dz-web/esboot-bundler-common';

import type { AddFunc } from '@/cfg/types';

export const addDefinePlugin: AddFunc = async (cfg, rspackCfg) => {
  rspackCfg.plugins.push(
    new EnvironmentPlugin(['NODE_ENV']),
    new DefinePlugin(addDefine(cfg))
  );
};
