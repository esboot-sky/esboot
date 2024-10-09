import webpack from 'webpack';
import { addDefine } from '@dz-web/esboot-bundler-common';

import type { AddFunc } from '@/cfg/types';

export const addDefinePlugin: AddFunc = async (cfg, webpackCfg) => {
  webpackCfg.plugins.push(
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.DefinePlugin(addDefine(cfg))
  );
};
