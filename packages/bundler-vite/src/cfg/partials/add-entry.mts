import { createHtmlPlugin } from 'vite-plugin-html';
import {
  addEntry as _addEntry,
  type AddEntryCBParams,
} from '@dz-web/esboot-bundler-common';

import type { AddFunc } from '@/cfg/types.mts';

export const addEntry: AddFunc = async (cfg, viteCfg) => {
  const { cwd, MPConfiguration, isSP } = cfg.config;
  let configRootPath = 'config';

  if (!isSP && MPConfiguration) {
    configRootPath = MPConfiguration.configRootPathOfPlatfrom;
  }

  const pages: any[] = [];
  await _addEntry(cfg, (v: AddEntryCBParams) => {
    const { chunkName, entry, title, template } = v;

    pages.push({
      entry: entry.replace(cwd, ''),
      filename: `${chunkName}.html`,
      template: `${configRootPath}/${template}`.replace(cwd, ''),
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

  console.log('pages', pages);
  // viteCfg.appType = 'mpa';
  // viteCfg.plugins!.push(createHtmlPlugin(isSP ? { ...pages[0] } : { pages }));
  viteCfg.plugins!.push(createHtmlPlugin({ ...pages[0] }));
};
