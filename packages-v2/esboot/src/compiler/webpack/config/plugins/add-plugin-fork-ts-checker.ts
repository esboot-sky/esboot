// import { searchCommand } from '@@/helpers/path';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

import { ApplyOpts } from '../types';

export const addForkTsCheckerWebpackPlugin = async (applyOpts: ApplyOpts) => {
  const { config, userOpts: { TSChecker }, isDev } = applyOpts;

  if (isDev && TSChecker) {
    config.plugins.push(
      new ForkTsCheckerWebpackPlugin({
        // typescript: {
        //   typescriptPath: searchCommand('typescript'),
        // },
      })
    );
  }
};
