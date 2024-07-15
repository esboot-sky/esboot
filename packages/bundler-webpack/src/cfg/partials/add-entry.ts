import { readFileSync } from 'fs';
import { basename, join } from 'path';

import { getExportProps } from '@umijs/ast';
import { glob } from 'glob';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import Config from 'webpack-5-chain';

import type { CompileTimeConfig } from '@dz-web/esboot';

import type { BundlerCfg } from '@/types';

interface EntryFileExportProps {
  title?: string;
  template?: string;
  name?: string;
  langJsonPicker?: string[];
}

export const addEntry = async (cfg: BundlerCfg, webpackCfg: Config) => {
  const { contentRootPath, configRootPath = '', ipv4 } = cfg.compileTimeCfg;
  const {
    server: { port },
  } = cfg.userOptions;

  const { ESBOOT_CONTENT_PATH = '', ESBOOT_CONTENT_PATTERN = '*' } =
    process.env;

  const files = await glob(`/**/${ESBOOT_CONTENT_PATTERN}.entry.tsx`, {
    root: join(contentRootPath, ESBOOT_CONTENT_PATH),
  });

  const entry: CompileTimeConfig['entry'] = {};

  files.forEach((file: string, index) => {
    const { title, template, name, langJsonPicker } =
      (getExportProps(readFileSync(file, 'utf-8')) as EntryFileExportProps) ||
      {};

    const fileName = basename(file, '.entry.tsx');
    const chunkName = name || fileName;
    const ensureTitle = title || fileName || 'ESboot APP';
    const tplRelativePath = `template/${template || 'index'}.html`;
    const ensureTpl = join(configRootPath, tplRelativePath);

    webpackCfg.entry(chunkName).add(file).end();

    webpackCfg
      .plugin(`html-webpack-plugin-${chunkName}-${index}`)
      .use(HtmlWebpackPlugin, [
        {
          inject: true,
          chunks: [chunkName],
          filename: `${chunkName}.html`,
          title: ensureTitle,
          template: ensureTpl,
          hash: true,
        },
      ]);

    entry[file] = {
      langJsonPicker,
      tpl: tplRelativePath,
      chunkName,
      fileName,
      title: ensureTitle,
      url: `http://${ipv4}:${port}/${chunkName}.html`,
    };
  });

  cfg.updateCompileTimeCfg({ entry });
};
