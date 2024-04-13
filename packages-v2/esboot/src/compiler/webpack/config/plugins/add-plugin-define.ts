import webpack from 'webpack';
import { addDefine } from '@@/compiler/utils/add-define';

import { ApplyOpts } from '../types';

export const addDefinePlugin = async (applyOpts: ApplyOpts) => {
  const {
    config,
  } = applyOpts;

  config.plugins.push(
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.DefinePlugin(addDefine())
  );
};
