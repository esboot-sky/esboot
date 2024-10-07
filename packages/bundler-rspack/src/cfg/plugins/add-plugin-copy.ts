import { join } from 'node:path';

import { CopyRspackPlugin, type CopyRspackPluginOptions } from '@rspack/core';
import { pathExistsSync, statSync } from '@dz-web/esboot-common/fs-extra';

import type { AddFunc } from '@/cfg/types';

export const addCopyPlugin: AddFunc = async (cfg, rspackCfg) => {
  const { staticPathList } = cfg.config;

  const filteredStaticPathList = staticPathList
    .map((item) => {
      const isExists = pathExistsSync(item.from);
      if (!isExists) return null;

      // RSPack bug: not support pattern is a specific file
      // https://github.com/web-infra-dev/rspack/issues/8056
      const isFile = statSync(item.from).isFile();
      return {
        ...item,
        from: isFile ? `${item.from}*` : `${item.from}/*`,
        toType: isFile ? 'file' : 'dir',
        to: (pathData: { context: string; absoluteFilename?: string }) => {
          const { context, absoluteFilename } = pathData;
          const relativePath = absoluteFilename?.split('/static')[1];
          console.log(relativePath, 'pathData');
          return relativePath ? join(context, 'dist/static', relativePath) : undefined;
        },
      };
    })
    .filter(Boolean) as CopyRspackPluginOptions['patterns'];

  console.log(filteredStaticPathList, 'filteredStaticPathList');

  rspackCfg.plugins.push(
    new CopyRspackPlugin({
      patterns: [...filteredStaticPathList],
    })
  );
};
