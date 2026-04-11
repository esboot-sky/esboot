import type { AddEntryCBParams } from '@dz-web/esboot-bundler-common';
import type { AddFunc } from '@/cfg/types';
import {
  addEntry as _addEntry,
  createEntryValueIntent,
  createHtmlPageIntent,
  resolveTemplateRootPath,
} from '@dz-web/esboot-bundler-common';

import { HtmlRspackPlugin } from '@rspack/core';

export const addEntry: AddFunc = async (cfg, rspackCfg) => {
  const {
    configRootPath,
    MPConfiguration,
    isSP,
    isDev,
    publicPath,
    useLangJsonPicker,
  } = cfg.config;
  const tplRootPath = resolveTemplateRootPath({
    configRootPath,
    MPConfiguration,
    isSP,
  });

  const enableLangJsonPicker = useLangJsonPicker;
  await _addEntry(cfg, (params: AddEntryCBParams) => {
    const { chunkName, template, entry, title } = params;
    const pageIntent = createHtmlPageIntent({
      chunkName,
      title,
      template,
      templateRootPath: tplRootPath,
      isDev,
    });

    rspackCfg.entry[chunkName] = createEntryValueIntent({
      chunkName,
      entry,
      enableLangJsonPicker,
    });
    rspackCfg.plugins.push(
      new HtmlRspackPlugin({
        publicPath,
        chunks: pageIntent.chunks,
        filename: pageIntent.filename,
        title: pageIntent.title,
        template: pageIntent.template,
        inject: true,
        hash: true,
        minify: !pageIntent.isDev,
        scriptLoading: 'defer',
        // templateParameters: {
        //   htmlWebpackPlugin: {
        //     options: {
        //       title,
        //     },
        //   },
        // },
      }),
    );
  });
};
