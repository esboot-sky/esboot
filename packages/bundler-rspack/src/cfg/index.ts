import type { ConfigurationInstance } from '@dz-web/esboot';
import { Environment } from '@dz-web/esboot-common';

// Partials
import { addEntry } from './partials/add-entry';
import { addOutput } from './partials/add-output';
import { addResolve } from './partials/add-resolve';
import { addDevtool } from './partials/add-devtool';
import { addReact } from './partials/add-react';
import { addStyleRules } from './rules/add-rules-style';
import { addDevServer } from './add-dev-server';
import { addCache } from './partials/add-cache';
import { addExternals } from './partials/add-externals';

// Plugins
import { addPluginModifyHtml } from './plugins/add-plugin-modify-html';
import { addCopyPlugin } from './plugins/add-plugin-copy';
import { addDefinePlugin } from './plugins/add-plugin-define';
import { addProcessbarPlugin } from './plugins/add-plugin-processbar';

// Rules
import { addAssetRules } from './rules/add-rules-assets';
import { addJSONRules } from './rules/add-rules-json';
import { addJavaScriptRules } from './rules/add-rules-javascript';

import type { CustomRspackConfiguration } from './types';

import { customConfig } from './custom-config';
import { addOnlyDev } from './partials/add-only-dev';

export const getRspackCfg = async (
  cfg: ConfigurationInstance
): Promise<CustomRspackConfiguration> => {
  const { isDev } = cfg.config;

  const rspackCfg: CustomRspackConfiguration = {
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

  // Plugins
  await addPluginModifyHtml(cfg, rspackCfg);
  await addCopyPlugin(cfg, rspackCfg);
  await addDefinePlugin(cfg, rspackCfg);
  await addProcessbarPlugin(cfg, rspackCfg);

  // Only Dev
  await addDevServer(cfg, rspackCfg);
  await addOnlyDev(cfg, rspackCfg);

  // Custom
  await customConfig(cfg, rspackCfg);

  return rspackCfg;
};
