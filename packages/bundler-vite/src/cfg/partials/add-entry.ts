import {
  injectHtml,
  addEntry as _addEntry,
  type AddEntryCBParams,
} from '@dz-web/esboot-bundler-common';
import { join } from 'node:path';

import { loadHtmlContent } from '@/helpers/load-html-content';

import type { SharedConfig } from '@/types';
import type { AddFunc } from '@/cfg/types';

export const addEntry: AddFunc = async (cfg, viteCfg) => {
  const { cwd, MPConfiguration, isSP, isDev } = cfg.config;
  let configRootPath = 'config';

  if (!isSP && MPConfiguration) {
    configRootPath = MPConfiguration.configRootPathOfPlatfrom;
  }

  const pages: SharedConfig['pages'] = {};
  const entryPages: Record<string, string> = {};
  await _addEntry(cfg, (v: AddEntryCBParams) => {
    const { chunkName, entry, title, template } = v;

    entryPages[chunkName] = `${chunkName}.html`;
    pages[chunkName] = {
      template: join(configRootPath, template),
      entry: entry.replace(cwd, ''),
      title,
    };
    // pages.push({
    //   entry: entry.replace(cwd, ''),
    //   filename: `${chunkName}.html`,
    //   template: `${configRootPath}/${template}`.replace(`${cwd}`, ''),
    //   title,
    //   inject: {
    //     data: {
    //       isDev: isDev,
    //     },
    //   },
    // });
  });

  viteCfg.plugins!.push({
    name: 'vite-plugin-inject-body',
    transformIndexHtml(html) {
      return injectHtml(html, cfg);
    },
  });

  viteCfg.appType = 'custom';
  viteCfg.sharedConfig.pages = pages;
  if (isDev) return;

  if (!viteCfg.build) viteCfg.build = {};
  viteCfg.plugins!.push({
    name: 'vite-plugin-custom-html',
    resolveId(id) {
      if (id.endsWith('.html')) {
        return id;
      }
      return null;
    },
    async load(id) {
      if (id.endsWith('.html')) {
        const htmlName = id.replace('.html', '');

        return await loadHtmlContent(htmlName, pages, { isDev: false });
      }

      return null;
    },
  });

  if (!viteCfg.build.rollupOptions) viteCfg.build.rollupOptions = {};
  viteCfg.build.rollupOptions.input = entryPages;
};
