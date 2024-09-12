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

export interface AddEntryCBParams {
  title: string;
  entry: string;
  chunkName: string;
  template: string;
}

export const addEntry = async function (
  cfg: ConfigurationInstance,
  cb: (params: AddEntryCBParams) => void,
  options: {
    pattern?: string;
  } = {}
) {
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

  const { pattern } = options;
  const { ESBOOT_CONTENT_PATH = '', ESBOOT_CONTENT_PATTERN = '*' } =
    process.env;

  const files = await glob(
    `/**/${pattern || ESBOOT_CONTENT_PATTERN}.entry.tsx`,
    {
      root: join(contentRootPath, ESBOOT_CONTENT_PATH),
      ignore: ['**/node_modules/**', '**/test/**'],
    }
  );

  const entry: Configuration['entry'] = {};

  files.forEach((file: string) => {
    const { title, template, name, langJsonPicker } =
      (getExportProps(readFileSync(file, 'utf-8')) as EntryFileExportProps) ||
      {};

    const fileName = basename(file, '.entry.tsx');
    const chunkName = name || fileName;

    const ensureTitle = title || fileName || 'ESboot APP';
    const tplRelativePath = `template/${template || 'index'}.html`;

    cb({
      title: ensureTitle,
      entry: file,
      chunkName,
      template: tplRelativePath,
    });

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
