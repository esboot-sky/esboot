import { resolve } from 'path';
import { ConfigurationInstance } from '@dz-web/esboot';
import webpackbar from 'webpackbar';

import Config from 'webpack-5-chain';

import { addEntry } from './partials/add-entry';
import { addOutput } from './partials/add-output';
import { addResolve } from './partials/add-resolve';

import { addJavaScriptRules } from './rules/javascript/add-rules-javascript';

export const getWebpackCfg = async (cfg: ConfigurationInstance) => {
  const webpackChain = new Config();

  // Partial
  await addEntry(cfg, webpackChain);
  await addOutput(cfg, webpackChain);
  await addResolve(cfg, webpackChain);

  // Rules
  await addJavaScriptRules(cfg, webpackChain);

  return webpackChain;
};
