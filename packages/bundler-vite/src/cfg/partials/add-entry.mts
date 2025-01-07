import {
  injectHtml,
  addEntry as _addEntry,
  type AddEntryCBParams,
} from '@dz-web/esboot-bundler-common';

import type { AddFunc } from '@/cfg/types.mts';

export const addEntry: AddFunc = async (cfg, viteCfg) => {
  const { isDev } = cfg.config;
  viteCfg.plugins!.push({
    name: 'vite-plugin-inject-body',
    transformIndexHtml(html, ctx) {
      // console.log(ctx, 'ctx');

      return injectHtml(html, cfg, '1');
    },
  });

  if (isDev) return;

  if (!viteCfg.build) viteCfg.build = {};
  const { cwd, MPConfiguration, isSP } = cfg.config;
  let configRootPath = 'config';

  if (!isSP && MPConfiguration) {
    configRootPath = MPConfiguration.configRootPathOfPlatfrom;
  }

  const pages: Record<string, string> = {};
  await _addEntry(cfg, (v: AddEntryCBParams) => {
    const { chunkName, entry, title, template } = v;

    const tpl = `${configRootPath}/${template}`.replace(`${cwd}`, '');

    pages[chunkName] = tpl;
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

  console.log(pages);

  viteCfg.appType = 'custom';
  Object.assign(viteCfg.build, {
    rollupOptions: {
      input: pages,
      output: {
        entryFileNames: '[name].html',
        // Add a manual output mapping if needed
        manualChunks: {
          'test': 'config/pc/template/test'
        }
      },
    },
  });

  // createHtmlPlugin({ pages: pages })
  // viteCfg.plugins!.push(createHtmlPlugin(isSP ? { ...pages[0] } : { pages }));

};
