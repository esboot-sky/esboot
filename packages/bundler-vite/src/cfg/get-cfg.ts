import { join } from 'node:path';
import react from '@vitejs/plugin-react';

import { cacheDir, type Environment } from '@dz-web/esboot-common';
import {
  addPostcssPluginESBoot,
  addPostcssPluginTailwindcss,
  addDefine,
  addPostcssPluginPx2rem,
} from '@dz-web/esboot-bundler-common';
import { addEntry } from './partials/add-entry';
import { addStyle } from './partials/add-style';
import { addResolve } from './partials/add-resolve';
import { addDevServer } from './partials/add-dev-server';

import { addLangJsonPicker } from '../plugins/add-plugin-lang-json-picker';
import { addCopyPlugin } from '../plugins/add-plugin-copy';
import { addSvgrPlugin } from '../plugins/add-plugin-svgr';

import { addBuildCfg } from './build/add-build-cfg';

import type { ConfigurationInstance } from '@dz-web/esboot';
import type { BundlerViteOptions, CustomViteConfiguration } from '../types';

export const getCfg = async (
  cfg: ConfigurationInstance,
  mode: Environment
): Promise<CustomViteConfiguration> => {
  const { cwd, bundlerOptions = {}, publicPath, sourceMap } = cfg.config;
  const { customConfig } = bundlerOptions as BundlerViteOptions;

  const viteCfg: CustomViteConfiguration = {
    plugins: [react(
      {
        babel: {
          plugins: ['babel-plugin-react-compiler'],
        },
      }
    )],
    mode,
    configFile: false,
    publicDir: false,
    base: publicPath,
    root: cwd,
    cacheDir: join(cacheDir, '.vite'),
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      ...addDefine(cfg),
    },
    css: {
      devSourcemap: sourceMap,
      preprocessorOptions: {
        scss: {},
      },
      postcss: {
        plugins: [
          await addPostcssPluginESBoot(cfg),
          await addPostcssPluginTailwindcss(cfg),
          await addPostcssPluginPx2rem(cfg),
        ].filter(Boolean),
      },
    },
    sharedConfig: {
      pages: {},
    },
  };

  await addEntry(cfg, viteCfg);
  await addDevServer(cfg, viteCfg);
  await addResolve(cfg, viteCfg);

  await addSvgrPlugin(cfg, viteCfg);
  await addCopyPlugin(cfg, viteCfg);
  await addLangJsonPicker(cfg, viteCfg);
  await addStyle(cfg, viteCfg);
  await addBuildCfg(cfg, viteCfg);

  return customConfig ? customConfig(viteCfg, cfg.config) : viteCfg;
};
