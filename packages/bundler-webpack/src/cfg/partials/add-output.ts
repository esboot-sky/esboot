import { resolve } from 'node:path';
import { DEFAULT_OUTPUT_PATH } from '@dz-web/esboot-common/constants';

import type { AddFunc } from '@/cfg/types';

export const addOutput: AddFunc = async (cfg, webpackCfg) => {
  const { cwd, isDev, publicPath, outputPath } = cfg.config;

  webpackCfg.output = {
    publicPath,
    clean: !isDev,
    path: resolve(cwd, outputPath || DEFAULT_OUTPUT_PATH),
    filename: isDev ? 'js/[name].js' : 'js/[name].[chunkhash:5].js',
  };
};
