import { join } from 'node:path';
import {
  addEntry as _addEntry,
  type AddEntryCBParams,
} from '@dz-web/esboot-bundler-common';
import HtmlWebpackPlugin, { type Options } from 'html-webpack-plugin';

import type { AddFunc } from '@/cfg/types';

export const addEntry: AddFunc<{
  enableLangJsonPicker: boolean;
}> = async (cfg, webpackCfg, options) => {
  const { configRootPath, MPConfiguration, isSP, isDev } = cfg.config;
  let tplRootPath = configRootPath;
  if (!isSP && MPConfiguration) {
    tplRootPath = MPConfiguration.configRootPathOfPlatfrom;
  }
  const { enableLangJsonPicker } = options!;
  const htmlPluginCfg: Options = {
    inject: true,
    hash: true,
  };
  if (!isDev) {
    htmlPluginCfg.minify = {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
    };
  }

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
        ...htmlPluginCfg,
      })
    );
  });
};
