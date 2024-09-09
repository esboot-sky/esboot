import { createHtmlPlugin } from 'vite-plugin-html';
import {
  addEntry as _addEntry,
  type AddEntryCBParams,
} from '@dz-web/esboot-bundler-common';

import type { AddFunc } from '@/cfg/types.mts';

export const addEntry: AddFunc = async function (cfg, viteCfg) {
  const { cwd } = cfg.config;

  const pages: any[] = [];
  await _addEntry(cfg, (v: AddEntryCBParams) => {
    const { chunkName, entry, title, template } = v;
    pages.push({
      entry: entry.replace(cwd, ''),
      filename: `${chunkName}.html`,
      template: `/config/${template}`,
      inject: {
        data: {
          htmlWebpackPlugin: {
            options: {
              title,
            },
          },
        },
      },
    });
  });

  // viteCfg.appType = 'mpa';
  viteCfg.plugins!.push(
    createHtmlPlugin({
      minify: true,
      // FIXME: SUPPORT MPA
      ...pages[0],
      // pages,
    })
  );
};
