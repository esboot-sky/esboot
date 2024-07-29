import { ConfigurationInstance } from '@dz-web/esboot';
import { Environment } from '@dz-web/esboot-common';

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
// import webpackbar from 'webpackbar';

import Config from 'webpack-5-chain';

import { addEntry } from './partials/add-entry';
import { addOutput } from './partials/add-output';
import { addResolve } from './partials/add-resolve';

import { addJavaScriptRules } from './rules/javascript/add-rules-javascript';
import { addStyleRules } from './rules/style/add-rules-style';
import { addAssetRules } from './rules/add-rules-asset';

import { addInjectBodyPlugin } from './plugins/add-plugin-inject-body';
import { addCopyPlugin } from './plugins/add-plugin-copy';

import { addDevServer } from './add-dev-server';

export const getWebpackCfg = async (
  cfg: ConfigurationInstance
): Promise<Config> => {
  const { isDev } = cfg.config;
  const webpackChain = new Config();

  webpackChain.mode(isDev ? Environment.dev : Environment.prod);
  webpackChain.performance(true).performance.hints(isDev ? false : 'warning');

  // Partial
  await addEntry(cfg, webpackChain);
  await addOutput(cfg, webpackChain);
  await addResolve(cfg, webpackChain);

  // Rules
  await addJavaScriptRules(cfg, webpackChain);
  await addStyleRules(cfg, webpackChain);
  await addAssetRules(cfg, webpackChain);

  // Plugins
  await addInjectBodyPlugin(cfg, webpackChain);
  await addCopyPlugin(cfg, webpackChain);

  await addDevServer(cfg, webpackChain);

  webpackChain.when(isDev, (rule) => {
    rule
      .plugin('ReactRefreshWebpackPlugin')
      .use(ReactRefreshWebpackPlugin)
      .end();
  });

  return webpackChain;
};
