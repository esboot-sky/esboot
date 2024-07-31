import { join } from 'path';
import react from '@vitejs/plugin-react';

import { cacheDir, Environment } from '@dz-web/esboot-common';
import { addEntry } from './partials/add-entry.mts';

import type { InlineConfig } from 'vite';
import type { ConfigurationInstance } from '@dz-web/esboot';

export const getDevServer = async (
  cfg: ConfigurationInstance
): Promise<InlineConfig> => {
  const { cwd } = cfg.config;

  const viteCfg: InlineConfig = {
    plugins: [react()],
    mode: Environment.dev,
    configFile: false,
    publicDir: 'config',
    root: cwd,
    cacheDir: join(cacheDir, 'vite'),
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    server: {
      port: 1337,
    },
  };

  await addEntry(cfg, viteCfg);

  return viteCfg;
};
