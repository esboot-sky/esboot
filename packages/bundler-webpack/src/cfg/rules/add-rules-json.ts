import { resolve } from 'path';
import type { AddFunc } from '@/cfg/types';

export const addJSONRules: AddFunc = async function (cfg, webpackCfg) {
  const { useLangJsonPicker, isSP } = cfg.config;

  if (!useLangJsonPicker || isSP) return;

  webpackCfg.module.rules.push({
    test: /\.json$/,
    type: 'javascript/auto',
    use: [
      {
        loader: resolve(__dirname, 'loaders/lang-json-picker/index.js'),
        options: {
          config: cfg.config,
        },
      },
    ],
  });
};
