import { ConfigurationInstance } from '@dz-web/esboot';
import { Environment } from '@dz-web/esboot-common';

import { addEntry } from './partials/add-entry';
import { addOutput } from './partials/add-output';
import { addResolve } from './partials/add-resolve';
import { addDevtool } from './partials/add-devtool';
import { addCache } from './partials/add-cache';
import { addOptimization } from './partials/add-optimization';
import { addOnlyDev } from './partials/add-only-dev';

import { createMFSU } from './helpers/mfsu';

import { addJavaScriptRules } from './rules/javascript/add-rules-javascript';
import { addStyleRules } from './rules/style/add-rules-style';
import { addAssetRules } from './rules/add-rules-asset';
import { addJSONRules } from './rules/add-rules-json';

import { addInjectBodyPlugin } from './plugins/add-plugin-inject-body';
import { addCopyPlugin } from './plugins/add-plugin-copy';
import { addDefinePlugin } from './plugins/add-plugin-define';
import { addWebpackbarPlugin } from './plugins/add-plugin-webpackbar';
import { addBundleAnalyzerPlugin } from './plugins/add-plugin-bundle-analyzer';

import { addDevServer } from './add-dev-server';

import type { CustomWebpackConfiguration } from '@/cfg/types';

export const getWebpackCfg = async (
  cfg: ConfigurationInstance
): Promise<CustomWebpackConfiguration> => {
  const { isDev } = cfg.config;

  const webpackCfg: CustomWebpackConfiguration = {
    mode: isDev ? Environment.dev : Environment.prod,
    performance: {
      hints: isDev ? false : 'warning',
    },
    entry: {},
    plugins: [],
    devServer: {},
    module: {
      rules: [],
    },
  };

  const mfsu = createMFSU(cfg);

  // Partial
  await addEntry(cfg, webpackCfg);
  await addOutput(cfg, webpackCfg);
  await addResolve(cfg, webpackCfg);
  await addDevtool(cfg, webpackCfg);
  await addCache(cfg, webpackCfg);
  await addOptimization(cfg, webpackCfg);

  // Rules
  await addJavaScriptRules(cfg, webpackCfg, { mfsu });
  await addStyleRules(cfg, webpackCfg);
  await addAssetRules(cfg, webpackCfg);
  await addJSONRules(cfg, webpackCfg);

  // Plugins
  await addInjectBodyPlugin(cfg, webpackCfg);
  await addCopyPlugin(cfg, webpackCfg);
  await addDefinePlugin(cfg, webpackCfg);
  await addWebpackbarPlugin(cfg, webpackCfg);
  await addBundleAnalyzerPlugin(cfg, webpackCfg);

  await addDevServer(cfg, webpackCfg, { mfsu });

  addOnlyDev(cfg, webpackCfg);

  return webpackCfg;
};
