import { join } from 'path';
import {
  addEntry as _addEntry,
  type AddEntryCBParams,
} from '@dz-web/esboot-bundler-common';
const rspack = require('@rspack/core');

import type { AddFunc } from '@/cfg/types';

export const addEntry: AddFunc = async function (cfg, rspackCfg) {
  const { configRootPath, MPConfiguration, isSP } = cfg.config;
  const tplRootPath = isSP
    ? configRootPath
    : MPConfiguration!.configRootPathOfPlatfrom;

  await _addEntry(cfg, (params: AddEntryCBParams) => {
    const { chunkName, template, entry, title } = params;
    const ensureTpl = join(tplRootPath, template);

    rspackCfg.entry[chunkName] = entry;
    rspackCfg.plugins.push(
      new rspack.HtmlRspackPlugin({
        chunks: [chunkName],
        filename: `${chunkName}.html`,
        title,
        template: ensureTpl,
        inject: true,
        hash: true,
        minify: true,
        templateParameters: {
          title,
        },
      })
    );
  });

  console.log(rspackCfg.entry, '<-- rspackCfg.entry');
};
