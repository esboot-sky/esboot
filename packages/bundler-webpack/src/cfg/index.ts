import { Configuration } from 'webpack';
import { ConfigurationInstance } from '@dz-web/esboot';
import { Environment } from '@dz-web/esboot-common';

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

import { addEntry } from './partials/add-entry';
import { addOutput } from './partials/add-output';
import { addResolve } from './partials/add-resolve';

import { addJavaScriptRules } from './rules/javascript/add-rules-javascript';
import { addStyleRules } from './rules/style/add-rules-style';
import { addAssetRules } from './rules/add-rules-asset';

import { addInjectBodyPlugin } from './plugins/add-plugin-inject-body';
import { addCopyPlugin } from './plugins/add-plugin-copy';
import { addWebpackbarPlugin } from './plugins/add-plugin-webpackbar';

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

  // Partial
  await addEntry(cfg, webpackCfg);
  await addOutput(cfg, webpackCfg);
  await addResolve(cfg, webpackCfg);

  // // Rules
  await addJavaScriptRules(cfg, webpackCfg);
  // await addStyleRules(cfg, webpackChain);
  // await addAssetRules(cfg, webpackChain);

  // // Plugins
  // await addInjectBodyPlugin(cfg, webpackChain);
  // await addCopyPlugin(cfg, webpackChain);
  // await addWebpackbarPlugin(cfg, webpackChain);

  // await addDevServer(cfg, webpackChain);

  // webpackChain.when(isDev, (chain) => {
  //   chain
  //     .plugin('ReactRefreshWebpackPlugin')
  //     .use(ReactRefreshWebpackPlugin)
  //     .end();

  //   chain.stats('errors-only').infrastructureLogging({ level: 'error' });
  // });

  return webpackCfg;
};
