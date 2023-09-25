import { merge } from 'lodash';
import { USER_CONFIG_FILE, webpackCacheDir } from '@@/constants';

export const addCache = async (applyOpts: any) => {
  const { config, isDev } = applyOpts;

  if (isDev) return;

  merge(config, {
    optimization: {
      runtimeChunk: 'single',
      moduleIds: 'deterministic',
    },
    cache: {
      type: 'filesystem',
      cacheDirectory: webpackCacheDir,
      buildDependencies: {
        config: [USER_CONFIG_FILE],
      },
    },
  });
};
