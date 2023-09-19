import CopyPlugin from 'copy-webpack-plugin';
import { pathExistsSync } from 'fs-extra';
import esbootConfig from '@@/config';

import { ApplyOpts } from '../types';

export const addCopyPlugin = async (applyOpts: ApplyOpts) => {
  const {
    configRootPath,
    configRootPathOfPlatfrom,
    configRootPathOfPageType,
    configJSPath,
  } = esbootConfig.compileTimeCfg;
  const {
    config,
    userOpts: { copy = [] },
  } = applyOpts;

  const copyList = [
    {
      from: configJSPath as string,
      to: './config.js',
    },
    {
      from: `${configRootPathOfPageType}/static`,
      to: './static',
    },
    {
      from: `${configRootPathOfPlatfrom}/static`,
      to: './static',
    },
    {
      from: `${configRootPath}/static`,
      to: './static',
    },
  ] as const;

  config.plugins.push(
    new CopyPlugin({
      patterns: [
        ...copy,
        ...copyList.filter((item) => pathExistsSync(item.from)),
      ],
    })
  );
};
