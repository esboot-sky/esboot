import { resolve } from 'node:path';
import type { AddFunc } from '@/cfg/types';

export const addJSONRules: AddFunc = async (cfg, rspack) => {
  const { useLangJsonPicker, entry } = cfg.config;

  if (!useLangJsonPicker) return;

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

  rspack.experiments.layers = true;
  rspack.module.rules.push({
    test: /\.json$/,
    type: 'javascript/auto',
    oneOf: list,
  });
};
