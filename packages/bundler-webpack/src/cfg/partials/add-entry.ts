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

  let contentRootPath = rootPath;
  if (!isSP && MPConfiguration) {
    contentRootPath = MPConfiguration.contentRootPath;
  }

  const { ESBOOT_CONTENT_PATH = '', ESBOOT_CONTENT_PATTERN = '*' } =
    process.env;

  const files = await glob(`/**/${ESBOOT_CONTENT_PATTERN}.entry.tsx`, {
    root: join(contentRootPath, ESBOOT_CONTENT_PATH),
    ignore: ['**/node_modules/**', '**/test/**'],
  });

  const entry: Configuration['entry'] = {};

  files.forEach((file: string) => {
    const { title, template, name, langJsonPicker } =
      (getExportProps(readFileSync(file, 'utf-8')) as EntryFileExportProps) ||
      {};

    const fileName = basename(file, '.entry.tsx');
    const chunkName = name || fileName;
    const ensureTitle = title || fileName || 'ESboot APP';
    const tplRelativePath = `template/${template || 'index'}.html`;
    const ensureTpl = join(configRootPath, tplRelativePath);

    webpackCfg.entry[chunkName] = file;
    webpackCfg.plugins.push(
      new HtmlWebpackPlugin({
        inject: true,
        chunks: [chunkName],
        filename: `${chunkName}.html`,
        title: ensureTitle,
        template: ensureTpl,
        hash: true,
      })
    );

    entry[file] = {
      langJsonPicker,
      tpl: tplRelativePath,
      chunkName,
      fileName,
      title: ensureTitle,
      url: `http://${ipv4}:${port}/${chunkName}.html`,
    };
  });

  cfg.patch({ entry });
};
