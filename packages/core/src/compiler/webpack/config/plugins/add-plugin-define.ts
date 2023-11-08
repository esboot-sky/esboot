import webpack from 'webpack';
import esbootConfig from '@@/config';

import { ApplyOpts } from '../types';

export const addDefinePlugin = async (applyOpts: ApplyOpts) => {
  const { version } = esbootConfig.compileTimeConfig;

  const {
    config,
    userOpts: { define = {} },
  } = applyOpts;

  const customDefine: Record<string, string> = {};
  for (const key in define) {
    customDefine[key] = JSON.stringify(define[key]);
  }

  config.plugins.push(
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.DefinePlugin({
      'process.env.VERSION': JSON.stringify(version),
      ...customDefine,
    })
  );
};
