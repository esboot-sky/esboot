import { CopyRspackPlugin, type CopyRspackPluginOptions } from '@rspack/core';
import { pathExistsSync } from '@dz-web/esboot-common/fs-extra';

import type { AddFunc } from '@/cfg/types';

export const addCopyPlugin: AddFunc = async (cfg, rspackCfg) => {
  const { staticPathList } = cfg.config;

  const filteredStaticPathList = staticPathList
    .map((item) => {
      const isExists = pathExistsSync(item.from);
      if (!isExists) return null;

      return item;
    })
    .filter(Boolean) as CopyRspackPluginOptions['patterns'];

  rspackCfg.plugins.push(
    new CopyRspackPlugin({
      patterns: [...filteredStaticPathList],
    })
  );
};
