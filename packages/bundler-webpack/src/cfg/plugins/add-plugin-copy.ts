import type { AddFunc } from '@/cfg/types';
import { pathExistsSync } from '@dz-web/esboot-common/fs-extra';

import CopyPlugin from 'copy-webpack-plugin';

export const addCopyPlugin: AddFunc = async (cfg, webpackCfg) => {
  const { staticPathList } = cfg.config;

  const filteredStaticPathList = staticPathList.filter(item =>
    pathExistsSync(item.from),
  );

  console.log(filteredStaticPathList, '<-- filteredStaticPathList');

  webpackCfg.plugins.push(
    new CopyPlugin({
      patterns: [...filteredStaticPathList],
    }),
  );
};
