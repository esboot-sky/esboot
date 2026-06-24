import type { AddFunc } from '@/cfg/types';

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const addStyleNameRules: AddFunc = async (cfg, rspackCfg) => {
  const useStyleName = cfg.config.css?.modules?.useStyleName;

  if (useStyleName === false)
    return;

  const loaderPath = resolve(__dirname, 'loaders/style-name-loader.js');

  rspackCfg.module.rules.push({
    test: /\.tsx?$/,
    enforce: 'pre',
    loader: loaderPath,
    type: 'javascript/auto',
  });
};
