import { addEntry as _addEntry } from '@dz-web/esboot-bundler-common';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import type { AddFunc } from '@/cfg/types';

interface EntryFileExportProps {
  title?: string;
  template?: string;
  name?: string;
  langJsonPicker?: string[];
}

export const addEntry: AddFunc = async function (cfg, webpackCfg) {
  const {
    isSP,
    MPConfiguration,
    configRootPath = '',
    ipv4,
    rootPath,
    server: { port },
  } = cfg.config;

  await _addEntry(cfg, (v) => {
    // configRootPath
    webpackCfg.entry[chunkName] = file;
    webpackCfg.plugins.push(
      new HtmlWebpackPlugin({
        chunks: [chunkName],
        filename: `${chunkName}.html`,
        title: ensureTitle,
        template: ensureTpl,
        inject: true,
        hash: true,
      })
    );
  });
};
