import { resolve } from 'path';
import { Configuration } from '@/types';
import webpack, { Configuration as WebpackConfiguration } from 'webpack';
import webpackbar from 'webpackbar';

import Config from 'webpack-5-chain';

import { addEntry } from './partials/add-entry';

export const getWebpackCfg = async (cfg: Configuration) => {
  const webpackCfg = new Config();

  // Partial
  await addEntry(cfg, webpackCfg);

  return webpackCfg;
};
