import { resolve } from 'node:path';
import type { AddFunc } from '@/cfg/types';

export const addJSONRules: AddFunc<{ enableLangJsonPicker: boolean }> = async (
  cfg,
  webpackCfg,
  options
) => {
  const { entry } = cfg.config;
  const { enableLangJsonPicker } = options!;

  if (!enableLangJsonPicker) return;

  const list = Object.values(entry).map((item) => ({
    issuerLayer: item.chunkName,
    use: [
      {
        loader: resolve(__dirname, 'loaders/lang-json-picker/index.js'),
        options: {
          config: cfg.config,
        },
      },
    ],
  }));

  webpackCfg.experiments.layers = true;
  webpackCfg.module.rules.push({
    test: /\.json$/,
    type: 'javascript/auto',
    oneOf: list,
  });
};
