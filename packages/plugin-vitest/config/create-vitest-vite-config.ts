import type { Configuration, ConfigurationInstance } from '@dz-web/esboot';
import type { InlineConfig } from 'vite';
// eslint-disable-next-line antfu/no-import-dist
import type { PluginVitestOptions } from '../dist/options.js';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  addDefine,
  addPostcssPluginESBoot,
  addPostcssPluginPx2rem,
  addPostcssPluginTailwindcss,
  addReactCompiler,
  reactStyleNamePlugin,
} from '@dz-web/esboot-bundler-common';
import { cacheDir } from '@dz-web/esboot-common/constants';
import react from '@vitejs/plugin-react';
import vitePluginSvgr from 'vite-plugin-svgr';

import { configDefaults } from 'vitest/config';
// eslint-disable-next-line antfu/no-import-dist
import { alias as vitestAlias } from '../dist/alias.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const STYLE_GLOBAL_PATH_RE = /styles/;

function createAlias(cfg: ConfigurationInstance): Record<string, string> {
  const { alias, cwd } = cfg.config;
  const customAlias: Configuration['alias'] = {};

  for (const key in alias) {
    customAlias[key] = join(cwd, `./${alias[key]}/`);
  }

  return {
    ...customAlias,
    ...vitestAlias,
  };
}

function createCssModules(cfg: ConfigurationInstance): InlineConfig['css'] {
  const { localsConvention } = cfg.config.css?.modules || {};
  const viteLocalsConvention = localsConvention === 'asIs'
    ? undefined
    : localsConvention;

  return {
    devSourcemap: cfg.config.sourceMap,
    preprocessorOptions: {
      scss: {},
    },
    postcss: {
      plugins: [],
    },
    modules: {
      generateScopedName: '[name]__[local]___[hash:base64:5]',
      hashPrefix: 'prefix',
      globalModulePaths: [STYLE_GLOBAL_PATH_RE],
      scopeBehaviour: 'local',
      exportGlobals: true,
      ...(viteLocalsConvention ? { localsConvention: viteLocalsConvention } : {}),
    },
  };
}

export function createVitestTestConfig(): Pick<InlineConfig, 'test'> {
  return {
    test: {
      include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
      forceRerunTriggers: [
        ...configDefaults.forceRerunTriggers,
        '**/*.test.{ts,tsx}',
        '**/*.{ts,tsx}',
      ],
      setupFiles: [join(__dirname, './setup.ts')],
      environment: 'jsdom',
    },
  };
}

export async function createVitestViteConfig(
  cfg: ConfigurationInstance,
  options: PluginVitestOptions = {},
): Promise<InlineConfig> {
  const { cwd, publicPath, isDev, rootPath, isSP, svgr, svgrOptions = {} } = cfg.config;
  const { useStyleName } = cfg.config.css?.modules || {};
  const { customConfig } = options;

  const viteConfig: InlineConfig = {
    plugins: [
      react({
        babel: {
          plugins: [!isDev && addReactCompiler(cfg)].filter(Boolean),
        },
      }),
      ...reactStyleNamePlugin({ rootPath, isSP, useStyleName }),
    ],
    mode: 'test',
    configFile: false,
    publicDir: false,
    base: publicPath,
    root: cwd,
    cacheDir: join(cacheDir, '.vite'),
    define: {
      ...addDefine(cfg),
    },
    css: createCssModules(cfg),
    resolve: {
      alias: createAlias(cfg),
    },
    ...createVitestTestConfig(),
  };

  viteConfig.css!.postcss = {
    plugins: [
      await addPostcssPluginESBoot(cfg),
      await addPostcssPluginTailwindcss(cfg),
      await addPostcssPluginPx2rem(cfg),
    ].filter(Boolean),
  };

  if (svgr) {
    viteConfig.plugins!.push(
      vitePluginSvgr({
        include: '**/*.svg',
        exclude: '**/*.svg?url',
        svgrOptions: {
          plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
          svgoConfig: {
            floatPrecision: 2,
          },
          ...svgrOptions,
        },
      }),
    );
  }

  return customConfig
    ? await customConfig(viteConfig, cfg.config)
    : viteConfig;
}
