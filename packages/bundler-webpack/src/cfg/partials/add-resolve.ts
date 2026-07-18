import type { Configuration } from '@dz-web/esboot';
import type { AddFunc } from '@/cfg/types';
import { createResolveIntent } from '@dz-web/esboot-bundler-common';

export const addResolve: AddFunc = async (cfg, webpackCfg) => {
  const { alias, cwd } = cfg.config;
  webpackCfg.resolve = createResolveIntent({
    alias: alias as Configuration['alias'],
    cwd,
    includeMainFields: true,
  });
};
