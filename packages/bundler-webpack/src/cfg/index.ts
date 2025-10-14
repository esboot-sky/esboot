import type { ConfigurationInstance } from '@dz-web/esboot';
import type { CustomWebpackConfiguration } from '@/cfg/types';

import { Environment } from '@dz-web/esboot-common';
import { addDevServer } from './add-dev-server';
import { customConfig } from './helpers/custom-config';
import { createMFSU, wrapCfgWithMfsu } from './helpers/mfsu';
import { addOptimization } from './optimization/add-optimization';
import { addCache } from './partials/add-cache';
import { addDevtool } from './partials/add-devtool';

import { addEntry } from './partials/add-entry';

import { addExternals } from './partials/add-externals';
import { addOnlyDev } from './partials/add-only-dev';

import { addOutput } from './partials/add-output';
import { addResolve } from './partials/add-resolve';
// import { addWebpackbarPlugin } from './plugins/add-plugin-webpackbar';
import { addBundleAnalyzerPlugin } from './plugins/add-plugin-bundle-analyzer';
import { addCopyPlugin } from './plugins/add-plugin-copy';

import { addDefinePlugin } from './plugins/add-plugin-define';
import { addPluginModifyHtml } from './plugins/add-plugin-modify-html';
import { addProcessbarPlugin } from './plugins/add-plugin-processbar';
import { addAssetRules } from './rules/add-rules-asset';
import { addJSONRules } from './rules/add-rules-json';

import { addJavaScriptRules } from './rules/javascript/add-rules-javascript';

import { addStyleRules } from './rules/style/add-rules-style';

export async function getWebpackCfg(cfg: ConfigurationInstance): Promise<CustomWebpackConfiguration> {
  const { useLangJsonPicker, isDev } = cfg.config;

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
  const enableLangJsonPicker = useLangJsonPicker && !mfsu;

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
}
