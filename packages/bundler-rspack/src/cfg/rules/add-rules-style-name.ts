import type { AddFunc } from '@/cfg/types';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Adds a pre-loader rule that transforms JSX `styleName` attributes to
 * `className` lookups.  The loader is the shared JS implementation from
 * `bundler-common`, giving identical behaviour to the Vite adapter.
 *
 * The rule only runs when `css.modules.useStyleName` is not explicitly `false`.
 */
export const addStyleNameRules: AddFunc = async (cfg, rspackCfg) => {
  const useStyleName = cfg.config.css?.modules?.useStyleName;

  if (useStyleName === false)
    return;

  // This file is bundled into dist/index.js, so import.meta.url (and __dirname)
  // points to the dist/ directory. The loader lives alongside at dist/loaders/.
  const loaderPath = resolve(__dirname, 'loaders/style-name-loader.js');

  rspackCfg.module.rules.push({
    test: /\.tsx?$/,
    enforce: 'pre',
    loader: loaderPath,
    type: 'javascript/auto',
  });
};
