import { USER_CONFIG_FILE, webpackCacheDir } from '@@/constants';

export const addCache = async (applyOpts: any) => {
  const { chainedConfig, isDev } = applyOpts;

  if (isDev) return;

  chainedConfig.optimization.runtimeChunk('single').moduleIds('deterministic');

  chainedConfig.cache
    .type('filesystem')
    .cacheDirectory(webpackCacheDir)
    .buildDependencies.config([USER_CONFIG_FILE]);
};
