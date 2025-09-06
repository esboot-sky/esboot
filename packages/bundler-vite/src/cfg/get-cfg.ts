import type { BabelPlugin, ConfigurationInstance } from '@dz-web/esboot';
import type { Environment } from '@dz-web/esboot-common';
import type { BundlerViteOptions, CustomViteConfiguration } from '../types';

import { join } from 'node:path';
import process from 'node:process';
import {
  addDefine,
  addPostcssPluginESBoot,
  addPostcssPluginPx2rem,
  addPostcssPluginTailwindcss,
  addReactCompiler,
} from '@dz-web/esboot-bundler-common';
import { cacheDir } from '@dz-web/esboot-common';
import react from '@vitejs/plugin-react';
import { addCopyPlugin } from '../plugins/add-plugin-copy';
import { addLangJsonPicker } from '../plugins/add-plugin-lang-json-picker';

import { addSvgrPlugin } from '../plugins/add-plugin-svgr';
import { addBuildCfg } from './build/add-build-cfg';
import { addDevServer } from './partials/add-dev-server';

import { addEntry } from './partials/add-entry';

import { addResolve } from './partials/add-resolve';
import { addStyle } from './partials/add-style';

export async function getCfg(cfg: ConfigurationInstance, mode: Environment, options: {
  onModifyBundlerConfig?: (cfg: CustomViteConfiguration) => CustomViteConfiguration;
}): Promise<CustomViteConfiguration> {
  const { onModifyBundlerConfig } = options;
  const { cwd, bundlerOptions = {}, publicPath, sourceMap } = cfg.config;
  const { customConfig } = bundlerOptions as BundlerViteOptions;

  let viteCfg: CustomViteConfiguration = {
    plugins: [
      react(
        {
          babel: {
            plugins: [addReactCompiler(cfg)].filter(Boolean) as BabelPlugin[],
          },
        },
      ),
    ],
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

  if (onModifyBundlerConfig) {
    viteCfg = onModifyBundlerConfig(viteCfg);
  }
  return customConfig ? customConfig(viteCfg, cfg.config) : viteCfg;
}
