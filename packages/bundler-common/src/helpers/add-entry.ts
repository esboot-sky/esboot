import type { Configuration, ConfigurationInstance } from '@dz-web/esboot';
import { readFileSync } from 'node:fs';

import { join } from 'node:path';
import { shellEnv } from '@dz-web/esboot-common/environment';
import { getExportProps } from '@umijs/ast';
import { glob } from 'tinyglobby';

const ENTRY_FILENAME_RE = /([^/\\]+)\.entry\.(ts|tsx)$/;

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

export async function addEntry(cfg: ConfigurationInstance, cb?: (params: AddEntryCBParams) => void, options: {
  contentPath?: string;
  pattern?: string;
  ignore?: string;
} = {}): Promise<void> {
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
  const contentPathFromEnv = shellEnv.get('ESBOOT_CONTENT_PATH', '');
  const patternFromEnv = shellEnv.get('ESBOOT_CONTENT_PATTERN', '*');
  const ignoreFromEnv = shellEnv.get('ESBOOT_CONTENT_IGNORE', ignore);

  const ignoreList = ignoreFromEnv
    ? ignoreFromEnv.split(',').map(v => `**/${v}.entry.ts?(x)`)
    : [];

  const cwd = join(contentRootPath, contentPath || contentPathFromEnv);
  const files = await glob(
    `**/${pattern || patternFromEnv}.entry.ts?(x)`,
    {
      cwd,
      ignore: ['**/node_modules/**', '**/test/**', ...ignoreList],
    },
  );

  const entry: Configuration['entry'] = {};

  for (const file of files) {
    const _file = join(cwd, file);
    const { title, template, name, langJsonPicker, urlParams }
      = (getExportProps(readFileSync(_file, 'utf-8')) as EntryFileExportProps)
        || {};

    const fileName = (file.match(ENTRY_FILENAME_RE) || [])[1] || '';
    const chunkName = name || fileName;

    if (entry[chunkName]) {
      throw new Error(
        `Duplicate entry chunkName "${chunkName}" for "${entry[chunkName].entry}" and "${_file}".`,
      );
    }

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
}
