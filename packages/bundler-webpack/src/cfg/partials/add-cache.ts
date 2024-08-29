import { resolve } from 'path';
import {
  USER_CONFIG_FILE,
  webpackCacheDir,
} from '@dz-web/esboot-common/constants';
import type { AddFunc } from '@/cfg/types';

export const addCache: AddFunc = async function (cfg, webpackCfg) {
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
        USER_CONFIG_FILE,
        resolve(cwd, './pnpm-lock.yaml'),
        resolve(cwd, './package.json'),
      ],
    },
  };
};
