import { join } from 'node:path';
import {
  addEntry as _addEntry,
  type AddEntryCBParams,
} from '@dz-web/esboot-bundler-common';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import type { AddFunc } from '@/cfg/types';

export const addEntry: AddFunc<{
  enableLangJsonPicker: boolean;
}> = async (cfg, webpackCfg, options) => {
  const { configRootPath, MPConfiguration, isSP } = cfg.config;
  let tplRootPath = configRootPath;
  if (!isSP && MPConfiguration) {
    tplRootPath = MPConfiguration.configRootPathOfPlatfrom;
  }
  const { enableLangJsonPicker } = options!;

  await _addEntry(cfg, (params: AddEntryCBParams) => {
    const { chunkName, template, entry, title } = params;
    const ensureTpl = join(tplRootPath, template);

    if (enableLangJsonPicker) {
      webpackCfg.entry[chunkName] = {
        import: entry,
        layer: chunkName,
      };
    } else {
      webpackCfg.entry[chunkName] = entry;
    }

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
};
