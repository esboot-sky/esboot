import { readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import type { ConfigurationInstance } from '@dz-web/esboot';

import { getExportProps } from '@umijs/ast';
import type { Configuration } from '@dz-web/esboot';
import { glob } from 'tinyglobby';

interface EntryFileExportProps {
  title?: string;
  template?: string;
  name?: string;
  langJsonPicker?: string[];
  urlParams?: string;
}

export interface AddEntryCBParams {
  title: string;
  entry: string;
  chunkName: string;
  template: string;
  urlParams?: string;
}

export const addEntry = async (
  cfg: ConfigurationInstance,
  cb?: (params: AddEntryCBParams) => void,
  options: {
    contentPath?: string;
    pattern?: string;
    ignore?: string;
  } = {}
) => {
  const {
    isSP,
    MPConfiguration,
    ipv4,
    rootPath,
    server: { port },
  } = cfg.config;

  let contentRootPath = rootPath;
  if (!isSP && MPConfiguration) {
    contentRootPath = MPConfiguration.contentRootPath;
  }

  const { pattern, contentPath, ignore = '' } = options;
  const {
    ESBOOT_CONTENT_PATH = '',
    ESBOOT_CONTENT_PATTERN = '*',
    ESBOOT_CONTENT_IGNORE = ignore,
  } = process.env;

  const ignoreList = ESBOOT_CONTENT_IGNORE
    ? ESBOOT_CONTENT_IGNORE.split(',').map((v) => `**/${v}.entry.tsx`)
    : [];

  const cwd = join(contentRootPath, contentPath || ESBOOT_CONTENT_PATH);
  const files = await glob(
    `**/${pattern || ESBOOT_CONTENT_PATTERN}.entry.tsx`,
    {
      cwd,
      ignore: ['**/node_modules/**', '**/test/**', ...ignoreList],
    }
  );

  const entry: Configuration['entry'] = {};

  for (const file of files) {
    const _file = join(cwd, file);
    const { title, template, name, langJsonPicker, urlParams } =
      (getExportProps(readFileSync(_file, 'utf-8')) as EntryFileExportProps) ||
      {};

    const fileName = basename(file, '.entry.tsx');
    const chunkName = name || fileName;

    const ensureTitle = title || fileName || 'ESBoot APP';
    const tplRelativePath = `template/${template || 'index'}.html`;

    cb?.({
      title: ensureTitle,
      entry: _file,
      chunkName,
      template: tplRelativePath,
      urlParams,
    });

    entry[chunkName] = {
      langJsonPicker,
      tpl: tplRelativePath,
      chunkName,
      fileName,
      entry: _file,
      title: ensureTitle,
      url: `http://${ipv4}:${port}/${chunkName}.html`,
    };

    if (urlParams) {
      Object.assign(entry[chunkName], {
        urlParams,
        url: `${entry[chunkName].url}${urlParams}`,
      });
    }
  }

  cfg.patch({ entry });
};
