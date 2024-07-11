import { resolve } from 'path';
import webpack, { Configuration } from 'webpack';
import webpackbar from 'webpackbar';

import type { BundlerCfg } from '../types';

export const getWebpackCfg = async (cfg: BundlerCfg) => {
  console.log(cfg, '<-- cfg');

  return {};
};
