import CopyPlugin from 'copy-webpack-plugin';
import { pathExistsSync } from '@dz-web/esboot-common/fs-extra';

import type { AddFunc } from '@/cfg/types';

export const addCopyPlugin: AddFunc = async function (cfg, webpackCfg) {
  const { staticPathList } = cfg.config;

  const filteredStaticPathList = staticPathList.filter((item) =>
    pathExistsSync(item.from)
  );

  webpackCfg.plugins.push(
    new CopyPlugin({
      patterns: [...filteredStaticPathList],
    })
  );
};
