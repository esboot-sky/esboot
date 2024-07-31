import { readFileSync } from 'fs';
import { basename, join } from 'path';
import type { ConfigurationInstance } from '@dz-web/esboot';

import { getExportProps } from '@umijs/ast';
import type { Configuration } from '@dz-web/esboot';
import { glob } from 'glob';

interface EntryFileExportProps {
  title?: string;
  template?: string;
  name?: string;
  langJsonPicker?: string[];
}

interface CBParams {
  title: string;
  entry: string,
  chunkName: string;
  template: string;
}

export const addEntry = async function (
  cfg: ConfigurationInstance,
  cb: (params: CBParams) => void
) {
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

    console.log({
      fileName,
      chunks: [chunkName],
      filename: `${chunkName}.html`,
      title: ensureTitle,
      template: ensureTpl,
      hash: true,
    });

    cb({
      title: ensureTitle,
      entry: file,
      chunkName,
      template: ensureTpl,
    });
    // webpackCfg.entry[chunkName] = file;
    // webpackCfg.plugins.push(
    //   new HtmlWebpackPlugin({
    //     inject: true,
    //     chunks: [chunkName],
    //     filename: `${chunkName}.html`,
    //     title: ensureTitle,
    //     template: ensureTpl,
    //     hash: true,
    //   })
    // );

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
