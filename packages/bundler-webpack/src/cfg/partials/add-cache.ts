import type { AddFunc } from '@/cfg/types';
import type { BundlerWebpackOptions } from '@/types';
import { resolve } from 'node:path';
import {
  getUserConfigFile,
  webpackCacheDir,
} from '@dz-web/esboot-common/constants';
import {
  createRuntimeOptimizationIntent,
  shouldEnableCacheIntent,
} from '@dz-web/esboot-bundler-common';

export const addCache: AddFunc = async (cfg, webpackCfg) => {
  const { isDev, isCIBuild, cwd, bundlerOptions = {} } = cfg.config;
  const { buildCache = false } = bundlerOptions as BundlerWebpackOptions;

  if (!shouldEnableCacheIntent({ isDev, isCIBuild, buildCache })) {
    return;
  }

  webpackCfg.optimization = createRuntimeOptimizationIntent();

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
