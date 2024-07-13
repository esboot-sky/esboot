import { resolve } from 'path';
import webpack, { Configuration } from 'webpack';
import webpackbar from 'webpackbar';

import Config from 'webpack-5-chain';

import { addEntry } from './partials/add-entry';

import type { BundlerCfg } from '../types';

export const getWebpackCfg = async (cfg: BundlerCfg) => {
  console.log(cfg, '<-- cfg');
  const webpackCfg = new Config();

  // Partial
  addEntry(cfg, webpackCfg);

  return {};
};
