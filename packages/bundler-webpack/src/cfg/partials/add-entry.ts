import { join } from 'path';
import {
  addEntry as _addEntry,
  type AddEntryCBParams,
} from '@dz-web/esboot-bundler-common';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import type { MFSU } from '@/cfg/helpers/mfsu';
import type { AddFunc } from '@/cfg/types';

export const addEntry: AddFunc<{ mfsu: MFSU }> = async function (
  cfg,
  webpackCfg,
  options
) {
  const { configRootPath, MPConfiguration, isSP, useLangJsonPicker } =
    cfg.config;
  const tplRootPath = isSP
    ? configRootPath
    : MPConfiguration!.configRootPathOfPlatfrom;
  const { mfsu } = options!;

  const enableLangJsonPicker = useLangJsonPicker && !isSP && mfsu;

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

  console.log(webpackCfg.entry, '<-- webpackCfg.entry');
};
