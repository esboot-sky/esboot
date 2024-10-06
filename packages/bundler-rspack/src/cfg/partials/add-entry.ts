import { join } from 'node:path';
import {
  addEntry as _addEntry,
  type AddEntryCBParams,
} from '@dz-web/esboot-bundler-common';
import { HtmlRspackPlugin } from '@rspack/core';

import type { AddFunc } from '@/cfg/types';

export const addEntry: AddFunc = async (cfg, rspackCfg) => {
  const { configRootPath, MPConfiguration, isSP, isDev, publicPath } = cfg.config;
  const tplRootPath = isSP
    ? configRootPath
    : MPConfiguration!.configRootPathOfPlatfrom;

  await _addEntry(cfg, (params: AddEntryCBParams) => {
    const { chunkName, template, entry, title } = params;
    const ensureTpl = join(tplRootPath, template);

    rspackCfg.entry[chunkName] = entry;
    rspackCfg.plugins.push(
      new HtmlRspackPlugin({
        publicPath,
        chunks: [chunkName],
        filename: `${chunkName}.html`,
        title,
        template: ensureTpl,
        inject: true,
        hash: true,
        minify: !isDev,
        scriptLoading: 'defer',
        // templateParameters: {
        //   htmlWebpackPlugin: {
        //     options: {
        //       title,
        //     },
        //   },
        // },
      })
    );
  });
  console.log(rspackCfg.entry, '<-- rspackCfg.entry');
};
