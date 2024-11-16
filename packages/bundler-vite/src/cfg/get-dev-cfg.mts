import { join } from 'node:path';
import react from '@vitejs/plugin-react';
import vitePluginSvgr from 'vite-plugin-svgr';

import { cacheDir, Environment } from '@dz-web/esboot-common';
import { addTailwindCSS } from '@dz-web/esboot-bundler-common';
import { addEntry } from './partials/add-entry.mts';
import { addStyle } from './partials/add-style/index.mts';
import { addResolve } from './partials/add-resolve.mts';
import { addCompatHtmlPlugin } from './partials/add-compat-html-plugin/index.mts';
import { addDevServer } from './partials/add-dev-server.mts';

import type { InlineConfig } from 'vite';
import type { ConfigurationInstance } from '@dz-web/esboot';
import type { BundlerViteOptions } from '../types.mts';

export const getDevCfg = async (
  cfg: ConfigurationInstance,
  mode: Environment
): Promise<InlineConfig> => {
  const { cwd, bundlerOptions = {} } = cfg.config;
  const { customConfig } = bundlerOptions as BundlerViteOptions;

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
    mode,
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
  };

  await addDevServer(cfg, viteCfg);
  await addResolve(cfg, viteCfg);

  if (mode !== Environment.test) {
    await addEntry(cfg, viteCfg);
  }
  await addStyle(cfg, viteCfg);

  await addCompatHtmlPlugin(cfg, viteCfg);

  return customConfig ? customConfig(viteCfg, cfg.config) : viteCfg;
};
