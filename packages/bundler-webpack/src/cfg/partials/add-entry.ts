import type { AddEntryCBParams } from '@dz-web/esboot-bundler-common';
import type { Options } from 'html-webpack-plugin';
import type { AddFunc } from '@/cfg/types';

import {
  addEntry as _addEntry,
  createEntryValueIntent,
  createHtmlPageIntent,
  resolveTemplateRootPath,
} from '@dz-web/esboot-bundler-common';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export const addEntry: AddFunc<{
  enableLangJsonPicker: boolean;
}> = async (cfg, webpackCfg, options) => {
  const { configRootPath, MPConfiguration, isSP, isDev } = cfg.config;
  const tplRootPath = resolveTemplateRootPath({
    configRootPath,
    MPConfiguration,
    isSP,
  });
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
    const pageIntent = createHtmlPageIntent({
      chunkName,
      title,
      template,
      templateRootPath: tplRootPath,
      isDev,
    });

    webpackCfg.entry[chunkName] = createEntryValueIntent({
      chunkName,
      entry,
      enableLangJsonPicker,
    });

    webpackCfg.plugins.push(
      new HtmlWebpackPlugin({
        chunks: pageIntent.chunks,
        filename: pageIntent.filename,
        title: pageIntent.title,
        template: pageIntent.template,
        templateParameters: {
          isDev: pageIntent.isDev,
        },
        ...htmlPluginCfg,
      }),
    );
  });
};
