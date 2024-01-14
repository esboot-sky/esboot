import CopyPlugin from 'copy-webpack-plugin';
import { pathExistsSync } from 'fs-extra';
import esbootConfig from '@@/config';

import { ApplyOpts } from '../types';

export const addCopyPlugin = async (applyOpts: ApplyOpts) => {
  const { staticPathList } = esbootConfig.compileTimeConfig;
  const {
    config,
    userOpts: { copy = [] },
  } = applyOpts;

  config.plugins.push(
    new CopyPlugin({
      patterns: [
        ...copy,
        ...staticPathList.filter((item) => pathExistsSync(item.from)),
      ],
    })
  );
};
