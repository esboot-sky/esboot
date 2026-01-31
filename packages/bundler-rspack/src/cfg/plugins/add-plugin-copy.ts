import type { CopyRspackPluginOptions } from '@rspack/core';
import type { AddFunc } from '@/cfg/types';

import { pathExistsSync } from '@dz-web/esboot-common/fs-extra';
import { CopyRspackPlugin } from '@rspack/core';

export const addCopyPlugin: AddFunc = async (cfg, rspackCfg) => {
  const { staticPathList } = cfg.config;

  const filteredStaticPathList = staticPathList
    .map((item) => {
      const isExists = pathExistsSync(item.from);
      if (!isExists)
        return null;

      return item;
    })
    .filter(Boolean) as CopyRspackPluginOptions['patterns'];

  rspackCfg.plugins.push(
    new CopyRspackPlugin({
      patterns: [...filteredStaticPathList],
    }),
  );
};
