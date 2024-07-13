import { getExportProps } from '@umijs/ast';
import { readFileSync } from 'fs';
import { basename, join } from 'path';
import { glob } from 'glob';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import Config from 'webpack-5-chain';

import type { BundlerCfg } from '@/types';

interface EntryFileExportProps {
  title?: string;
  template?: string;
  name?: string;
  langJsonPicker?: string[];
}

export const addEntry = async (cfg: BundlerCfg, webpackCfg: Config) => {
  console.log(2433223, '<-- 2433223');
  // const { contentRootPath, configRootPathOfPlatfrom, ipv4 } =
  //   esbootConfig.compileTimeConfig;

  // const { ESBOOT_CONTENT_PATH = '', ESBOOT_CONTENT_PATTERN = '*' } =
  //   process.env;

  // const {
  //   config,
  //   isDev,
  //   userOpts: { port },
  // } = applyOpts;
  // const files = await glob(`/**/${ESBOOT_CONTENT_PATTERN}.entry.tsx`, {
  //   root: join(contentRootPath, ESBOOT_CONTENT_PATH),
  // });

  // files.forEach((file: string, index) => {
  //   const { title, template, name, langJsonPicker } =
  //     (getExportProps(readFileSync(file, 'utf-8')) as EntryFileExportProps) ||
  //     {};

  //   const filename = basename(file, '.entry.tsx');
  //   const chunkName = name || filename;
  //   const ensureTitle = title || filename || 'ESboot APP';
  //   const tplRelativePath = `template/${template || 'index'}.html`;
  //   const ensureTpl = join(configRootPathOfPlatfrom, tplRelativePath);

  //   esbootConfig.compileTimeConfig._entry[file] = {
  //     langJsonPicker,
  //     tpl: tplRelativePath,
  //     chunkName,
  //     filename,
  //     title: ensureTitle,
  //     url: `http://${ipv4}:${port}/${chunkName}.html`,
  //   };

  //   config.entry[chunkName] = file;

  //   config.plugins.push(
  //     new HtmlWebpackPlugin({
  //       inject: true,
  //       chunks: [chunkName],
  //       filename: `${chunkName}.html`,
  //       title: ensureTitle,
  //       template: ensureTpl,
  //       hash: true,
  //     })
  //   );
  // });
};
