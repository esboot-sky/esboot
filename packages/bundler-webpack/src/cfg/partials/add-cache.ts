import { resolve } from 'node:path';
import {
  getUserConfigFile,
  webpackCacheDir,
} from '@dz-web/esboot-common/constants';
import type { AddFunc } from '@/cfg/types';

export const addCache: AddFunc = async (cfg, webpackCfg) => {
  const { isDev, isCIBuild, cwd } = cfg.config;

  if (isDev || isCIBuild) return;

  webpackCfg.optimization = {
    runtimeChunk: 'single',
    moduleIds: 'deterministic',
  };

  webpackCfg.cache = {
    type: 'filesystem',
    cacheDirectory: webpackCacheDir,
    buildDependencies: {
      config: [
        getUserConfigFile(cwd),
        resolve(cwd, './pnpm-lock.yaml'),
        resolve(cwd, './package.json'),
      ],
    },
  };
};
