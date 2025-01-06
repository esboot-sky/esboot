import { join } from 'node:path';
import react from '@vitejs/plugin-react';

import { cacheDir, Environment } from '@dz-web/esboot-common';
import {
  addPostcssPluginTailwindcss,
  addDefine,
  addPostcssPluginPx2rem,
} from '@dz-web/esboot-bundler-common';
import { addEntry } from './partials/add-entry.mts';
import { addStyle } from './partials/add-style/index.mts';
import { addResolve } from './partials/add-resolve.mts';
import { addDevServer } from './partials/add-dev-server.mts';

import { addCopyPlugin } from '../plugins/add-plugin-copy.mts';
import { addSvgrPlugin } from '../plugins/add-plugin-svgr.mts';

import { addBuildCfg } from './build/add-build-cfg.mts';

import type { InlineConfig } from 'vite';
import type { ConfigurationInstance } from '@dz-web/esboot';
import type { BundlerViteOptions, CustomViteConfiguration } from '../types.mts';

export const getCfg = async (
  cfg: ConfigurationInstance,
  mode: Environment
): Promise<InlineConfig> => {
  const { cwd, bundlerOptions = {}, publicPath } = cfg.config;
  const { customConfig } = bundlerOptions as BundlerViteOptions;

  const viteCfg: CustomViteConfiguration = {
    plugins: [react()],
    mode,
    configFile: false,
    // publicDir: false,
    base: publicPath,
    root: cwd,
    cacheDir: join(cacheDir, '.vite'),
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      ...addDefine(cfg),
    },
    css: {
      preprocessorOptions: {
        scss: {},
      },
      postcss: {
        plugins: [
          addPostcssPluginTailwindcss(cfg),
          addPostcssPluginPx2rem(cfg),
        ].filter(Boolean),
      },
    },
  };

  await addDevServer(cfg, viteCfg);
  await addResolve(cfg, viteCfg);

  await addSvgrPlugin(cfg, viteCfg);
  await addCopyPlugin(cfg, viteCfg);

  if (mode !== Environment.test) {
    await addEntry(cfg, viteCfg);
  }

  await addBuildCfg(cfg, viteCfg);
  await addStyle(cfg, viteCfg);

  return customConfig ? customConfig(viteCfg, cfg.config) : viteCfg;
};
