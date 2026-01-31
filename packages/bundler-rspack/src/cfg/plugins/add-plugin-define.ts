import type { AddFunc } from '@/cfg/types';
import { addDefine } from '@dz-web/esboot-bundler-common';

import { DefinePlugin, EnvironmentPlugin } from '@rspack/core';

export const addDefinePlugin: AddFunc = async (cfg, rspackCfg) => {
  rspackCfg.plugins.push(
    new EnvironmentPlugin(['NODE_ENV']),
    new DefinePlugin(addDefine(cfg)),
  );
};
