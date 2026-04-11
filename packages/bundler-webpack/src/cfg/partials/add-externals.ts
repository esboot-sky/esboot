import type { AddFunc } from '@/cfg/types';
import { resolveExternalsIntent } from '@dz-web/esboot-bundler-common';

export const addExternals: AddFunc = async (cfg, webpackCfg) => {
  const { externals } = cfg.config;
  const resolvedExternals = resolveExternalsIntent(externals);

  if (resolvedExternals) {
    webpackCfg.externals = resolvedExternals;
  }
};
