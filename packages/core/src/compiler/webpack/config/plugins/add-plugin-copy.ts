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
  } = esbootConfig.extralConfig;
  const {
    config,
    userOpts: { copy },
  } = applyOpts;

  const copyList = [
    {
      from: configJSPath,
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
  ];

  config.plugins.push(
    new CopyPlugin({
      patterns: [
        ...copy,
        ...copyList.filter((item) => pathExistsSync(item.from)),
      ],
    })
  );
};
