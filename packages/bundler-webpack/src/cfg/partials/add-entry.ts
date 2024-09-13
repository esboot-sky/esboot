import { join } from 'path';
import {
  addEntry as _addEntry,
  type AddEntryCBParams,
} from '@dz-web/esboot-bundler-common';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import type { AddFunc } from '@/cfg/types';

export const addEntry: AddFunc = async function (cfg, webpackCfg) {
  const { configRootPath, MPConfiguration, isSP } = cfg.config;
  const tplRootPath = isSP
    ? configRootPath
    : MPConfiguration!.configRootPathOfPlatfrom;

  await _addEntry(cfg, (params: AddEntryCBParams) => {
    const { chunkName, template, entry, title } = params;
    const ensureTpl = join(tplRootPath, template);

    webpackCfg.entry[chunkName] = {
      import: entry,
      layer: chunkName,
    };
    webpackCfg.plugins.push(
      new HtmlWebpackPlugin({
        chunks: [chunkName],
        filename: `${chunkName}.html`,
        title,
        template: ensureTpl,
        inject: true,
        hash: true,
      })
    );
  });

  console.log(webpackCfg.entry, '<-- webpackCfg.entry');
};
