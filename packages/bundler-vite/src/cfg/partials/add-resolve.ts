import type { Configuration } from '@dz-web/esboot';
import type { AddFunc } from '@/cfg/types';

import { isAbsolute, join } from 'node:path';

export const addResolve: AddFunc = async (cfg, viteCfg) => {
  const { alias, cwd } = cfg.config;
  const customAlias: Configuration['alias'] = {};

  for (const k in alias) {
    const val = alias[k];
    const value = isAbsolute(val) ? val : join(cwd, `./${val}/`);

    customAlias[k] = value;
  }

  viteCfg.resolve = {
    alias: customAlias,
  };
};
