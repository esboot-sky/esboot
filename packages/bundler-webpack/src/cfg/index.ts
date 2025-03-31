import type { ConfigurationInstance } from '@dz-web/esboot';
import { Environment } from '@dz-web/esboot-common';

import { addEntry } from './partials/add-entry';
import { addOutput } from './partials/add-output';
import { addResolve } from './partials/add-resolve';
import { addDevtool } from './partials/add-devtool';
import { addCache } from './partials/add-cache';
import { addExternals } from './partials/add-externals';
import { addOnlyDev } from './partials/add-only-dev';

import { addOptimization } from './optimization/add-optimization';

import { createMFSU, wrapCfgWithMfsu } from './helpers/mfsu';
import { customConfig } from './helpers/custom-config';

import { addJavaScriptRules } from './rules/javascript/add-rules-javascript';
import { addStyleRules } from './rules/style/add-rules-style';
import { addAssetRules } from './rules/add-rules-asset';
import { addJSONRules } from './rules/add-rules-json';

import { addPluginModifyHtml } from './plugins/add-plugin-modify-html';
import { addCopyPlugin } from './plugins/add-plugin-copy';
import { addDefinePlugin } from './plugins/add-plugin-define';
// import { addWebpackbarPlugin } from './plugins/add-plugin-webpackbar';
import { addBundleAnalyzerPlugin } from './plugins/add-plugin-bundle-analyzer';
import { addProcessbarPlugin } from './plugins/add-plugin-processbar';

import { addDevServer } from './add-dev-server';

import type { CustomWebpackConfiguration } from '@/cfg/types';

export const getWebpackCfg = async (
  cfg: ConfigurationInstance
): Promise<CustomWebpackConfiguration> => {
  const { useLangJsonPicker, isSP, isDev } = cfg.config;

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
    experiments: {},
  };

  const mfsu = createMFSU(cfg);
  const enableLangJsonPicker = useLangJsonPicker && !isSP && !mfsu;

  // Partial
  await addEntry(cfg, webpackCfg, { enableLangJsonPicker });
  await addOutput(cfg, webpackCfg);
  await addResolve(cfg, webpackCfg);
  await addDevtool(cfg, webpackCfg);
  await addCache(cfg, webpackCfg);
  await addExternals(cfg, webpackCfg);

  // Optimization
  await addOptimization(cfg, webpackCfg);

  // Rules
  await addJavaScriptRules(cfg, webpackCfg, { mfsu });
  await addStyleRules(cfg, webpackCfg);
  await addAssetRules(cfg, webpackCfg);
  await addJSONRules(cfg, webpackCfg, { enableLangJsonPicker });

  // Plugins
  await addPluginModifyHtml(cfg, webpackCfg);
  await addCopyPlugin(cfg, webpackCfg);
  await addDefinePlugin(cfg, webpackCfg);
  // await addWebpackbarPlugin(cfg, webpackCfg);
  await addProcessbarPlugin(cfg, webpackCfg);
  await addBundleAnalyzerPlugin(cfg, webpackCfg);

  await addDevServer(cfg, webpackCfg, { mfsu });

  addOnlyDev(cfg, webpackCfg);
  customConfig(cfg, webpackCfg);

  return wrapCfgWithMfsu(cfg, webpackCfg, { mfsu });
};
