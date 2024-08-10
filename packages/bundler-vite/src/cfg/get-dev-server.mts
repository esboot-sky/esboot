import { join } from 'path';
import react from '@vitejs/plugin-react';

import { cacheDir, Environment } from '@dz-web/esboot-common';
import { addTailwindCSS } from '@dz-web/esboot-bundler-common';
import { addEntry } from './partials/add-entry.mts';
import { addStyle } from './partials/add-style/index.mts';

import reactStyleName from '../plugins/react-style-name/index.mts';

import type { InlineConfig } from 'vite';
import type { ConfigurationInstance } from '@dz-web/esboot';

export const getDevServer = async (
  cfg: ConfigurationInstance
): Promise<InlineConfig> => {
  const { cwd } = cfg.config;

  console.log(reactStyleName, 'reactStyleName');
  
  const viteCfg: InlineConfig = {
    plugins: [reactStyleName(), react()],
    mode: Environment.dev,
    configFile: false,
    publicDir: 'config',
    root: cwd,
    cacheDir: join(cacheDir, '.vite'),
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    css: {
      postcss: {
        plugins: [addTailwindCSS(cfg)].filter(Boolean),
      },
    },
    server: {
      port: 1337,
    },
  };

  await addEntry(cfg, viteCfg);
  await addStyle(cfg, viteCfg);

  return viteCfg;
};
