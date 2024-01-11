import { getExportProps } from '@umijs/ast';
import { readFileSync } from 'fs';
import { basename, join } from 'path';
import { glob } from 'glob';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import esbootConfig from '@@/config';

import { ApplyOpts } from './types';

interface EntryFileExportProps {
  title?: string;
  template?: string;
  name?: string;
}

export const addEntry = async (applyOpts: ApplyOpts) => {
  const { contentRootPath, configRootPathOfPlatfrom, ipv4 } =
    esbootConfig.compileTimeConfig;

  const { ESBOOT_CONTENT_PATH = '', ESBOOT_CONTENT_PATTERN = '*' } =
    process.env;

  const {
    chainedConfig,
    userOpts: { port },
  } = applyOpts;
  const files = await glob(`/**/${ESBOOT_CONTENT_PATTERN}.entry.tsx`, {
    root: join(contentRootPath, ESBOOT_CONTENT_PATH),
  });

  esbootConfig.compileTimeConfig.entry = [];

  files.forEach((file: string, index) => {
    const { title, template, name } =
      (getExportProps(readFileSync(file, 'utf-8')) as EntryFileExportProps) ||
      {};

    const filename = basename(file, '.entry.tsx');
    const chunkName = name || filename;
    const ensureTitle = title || filename || 'ESboot APP';
    const tplRelativePath = `template/${template || 'index'}.html`;
    const ensureTpl = join(configRootPathOfPlatfrom, tplRelativePath);

    esbootConfig.compileTimeConfig.entry.push({
      tpl: tplRelativePath,
      entry: file,
      // chunkName,
      filename,
      title: ensureTitle,
      url: `http://${ipv4}:${port}/${chunkName}.html`,
    });

    chainedConfig.entry(chunkName).add(file);
    chainedConfig.plugin('html').use(HtmlWebpackPlugin, [
      {
        inject: true,
        chunks: ['chunkName'],
        filename: 'chunkName.html',
        title: 'ensureTitle',
        template: 'ensureTpl',
        hash: true,
      }
    ]);
  });
};
