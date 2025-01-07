import {
  injectHtml,
  addEntry as _addEntry,
  type AddEntryCBParams,
} from '@dz-web/esboot-bundler-common';
import path from 'node:path';
import fs from 'node:fs';
import { join } from 'node:path';
import type { AddFunc } from '@/cfg/types.mts';

export const addEntry: AddFunc = async (cfg, viteCfg) => {
  const { cwd, MPConfiguration, isSP, isDev } = cfg.config;
  let configRootPath = 'config';

  if (!isSP && MPConfiguration) {
    configRootPath = MPConfiguration.configRootPathOfPlatfrom;
  }

  const pages: Record<string, string> = {};
  await _addEntry(cfg, (v: AddEntryCBParams) => {
    const { chunkName, entry, title, template } = v;

    const tpl = `${configRootPath}/${template}`.replace(`${cwd}`, '');

    pages[chunkName] = `${chunkName}.html`;
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
    transformIndexHtml(html, ctx) {
      // console.log(ctx, 'ctx');

      return injectHtml(html, cfg, '1');
    },
  });

  viteCfg.appType = 'custom';
  if (isDev) return;

  if (!viteCfg.build) viteCfg.build = {};
  const { entry } = cfg.config;

  viteCfg.plugins!.push({
    name: 'vite-plugin-custom-html',
    resolveId(source) {
      if (source.endsWith('.html')) {
        return source;
      }
      return null;
    },
    load(id) {
      if (id.endsWith('.html')) {
        const htmlName = id.replace('.html', '');
        const pageInfo = entry[htmlName];

        const htmlPath = join(
          cwd,
          `${configRootPath}/${pageInfo.tpl}`.replace(`${cwd}`, '')
        );
        const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
        return htmlContent.replace(
          '</head>',
          `<script src="${pageInfo.entry.replace(cwd, '')}" type="module"></script></head>`
        );
      }

      return null;
    },
    // generateBundle(_, bundle) {
    //   // 修改输出文件名
    //   Object.keys(bundle).forEach((fileName) => {
    //     if (fileName.includes('disable-rem.html')) {
    //       const file = bundle[fileName];
    //       delete bundle[fileName];
    //       bundle['test2.html'] = file;
    //     }
    //   });
    // },
  });
  Object.assign(viteCfg.build, {
    rollupOptions: {
      input: pages,
      output: {
        // entryFileNames: (chunkInfo) => {
        //   // console.log(chunkInfo, `${chunkInfo.name}.html`, 'chunkInfo');
        //   return `${chunkInfo.name}.html`;
        // },
        // manualChunks: (id, { getModuleInfo }) => {
        //   console.log(id, getModuleInfo(id), 'id');
        //   return id;
        // },
      },
      // output: {
      //   entryFileNames: '[name].js',
      //   chunkFileNames: '[name].js',
      //   assetFileNames: '[name].[ext]',
      //   preserveEntrySignatures: 'strict',
      // },
    },
  });

  // createHtmlPlugin({ pages: pages })
  // viteCfg.plugins!.push(createHtmlPlugin(isSP ? { ...pages[0] } : { pages }));
};
