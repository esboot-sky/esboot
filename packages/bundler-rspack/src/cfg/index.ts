import type { ConfigurationInstance } from '@dz-web/esboot';
import type { CustomRspackConfiguration } from './types';

import { Environment } from '@dz-web/esboot-common';
import { addDevServer } from './add-dev-server';
import { customConfig } from './custom-config';
// Optimization
import { addOptimization } from './optimization/add-optimization';
// Partials
import { addCache } from './partials/add-cache';
import { addDevtool } from './partials/add-devtool';
import { addEntry } from './partials/add-entry';
import { addExternals } from './partials/add-externals';

import { addOnlyDev } from './partials/add-only-dev';

import { addOutput } from './partials/add-output';

import { addReact } from './partials/add-react';
import { addResolve } from './partials/add-resolve';
// Plugins
import { addBundleAnalyzerPlugin } from './plugins/add-plugin-bundle-analyzer';
import { addCopyPlugin } from './plugins/add-plugin-copy';
import { addDefinePlugin } from './plugins/add-plugin-define';

import { addPluginModifyHtml } from './plugins/add-plugin-modify-html';
import { addProcessbarPlugin } from './plugins/add-plugin-processbar';
// Rules
import { addAssetRules } from './rules/add-rules-assets';
import { addJavaScriptRules } from './rules/add-rules-javascript';

import { addJSONRules } from './rules/add-rules-json';

import { addStyleRules } from './rules/style/add-rules-style';

export async function getRspackCfg(
  cfg: ConfigurationInstance,
): Promise<CustomRspackConfiguration> {
  const { isDev } = cfg.config;

  const rspackCfg: CustomRspackConfiguration = {
    mode: isDev ? Environment.dev : Environment.prod,
    performance: {
      hints: isDev ? false : 'warning',
    },
    cache: isDev,
    entry: {},
    plugins: [],
    devServer: {},
    module: {
      rules: [],
    },
    experiments: {},
  };

  // Partial
  await addEntry(cfg, rspackCfg);
  await addOutput(cfg, rspackCfg);
  await addResolve(cfg, rspackCfg);
  await addDevtool(cfg, rspackCfg);
  await addCache(cfg, rspackCfg);
  await addExternals(cfg, rspackCfg);

  // Rules
  await addReact(cfg, rspackCfg);
  await addStyleRules(cfg, rspackCfg);
  await addAssetRules(cfg, rspackCfg);
  await addJSONRules(cfg, rspackCfg);
  await addJavaScriptRules(cfg, rspackCfg);

  // Optimization
  await addOptimization(cfg, rspackCfg);

  // Plugins
  await addPluginModifyHtml(cfg, rspackCfg);
  await addCopyPlugin(cfg, rspackCfg);
  await addDefinePlugin(cfg, rspackCfg);
  await addProcessbarPlugin(cfg, rspackCfg);
  await addBundleAnalyzerPlugin(cfg, rspackCfg);

  // Only Dev
  await addDevServer(cfg, rspackCfg);
  await addOnlyDev(cfg, rspackCfg);

  // Custom
  await customConfig(cfg, rspackCfg);

  return rspackCfg;
}
