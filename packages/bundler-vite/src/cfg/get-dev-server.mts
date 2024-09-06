import { join } from 'path';
import react from '@vitejs/plugin-react';
import vitePluginSvgr from 'vite-plugin-svgr';

import { cacheDir, Environment } from '@dz-web/esboot-common';
import { addTailwindCSS } from '@dz-web/esboot-bundler-common';
import { addEntry } from './partials/add-entry.mts';
import { addStyle } from './partials/add-style/index.mts';
import { addResolve } from './partials/add-resolve.mts';
import { addCompatHtmlPlugin } from './partials/add-compat-html-plugin/index.mts';

import type { InlineConfig } from 'vite';
import type { ConfigurationInstance } from '@dz-web/esboot';

export const getDevServer = async (
  cfg: ConfigurationInstance
): Promise<InlineConfig> => {
  const { cwd } = cfg.config;

  const viteCfg: InlineConfig = {
    plugins: [
      react(),
      // FIXME: vite-plugin-svgr 类型定义有问题
      // @ts-ignore
      vitePluginSvgr.default({
        include: '**/*.svg',
        exclude: '**/*.svg?url',
      }),
    ],
    mode: Environment.dev,
    configFile: false,
    publicDir: 'config',
    root: cwd,
    cacheDir: join(cacheDir, '.vite'),
    css: {
      preprocessorOptions: {
        scss: {
          modules: true,
        },
      },
      postcss: {
        plugins: [addTailwindCSS(cfg)].filter(Boolean),
      },
    },
    server: {
      port: 1337,
    },
  };

  await addResolve(cfg, viteCfg);
  await addEntry(cfg, viteCfg);
  await addStyle(cfg, viteCfg);

  await addCompatHtmlPlugin(cfg, viteCfg);

  return viteCfg;
};
