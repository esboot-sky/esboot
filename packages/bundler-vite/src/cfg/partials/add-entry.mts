import { createHtmlPlugin } from 'vite-plugin-html';
import { addEntry as _addEntry } from '@dz-web/esboot-bundler-common';

import type { AddFunc } from '../types.mts';

export const addEntry: AddFunc = async function (cfg, viteCfg) {
  const pages: any[] = [];
  await _addEntry(cfg, (v: any) => {
    const { chunkName, entry, title } = v;

    pages.push({
      entry,
      filename: `${chunkName}.html`,
      template: '/config/template/index.html',
      inject: {
        data: {
          title,
        },
      },
    });
    // console.log(v, '<-- v');
  });

  console.log(pages, '<-- pages');
  viteCfg.plugins?.push(
    createHtmlPlugin({
      minify: true,
      // ...pages[0],
      pages,
    })
  );
};
