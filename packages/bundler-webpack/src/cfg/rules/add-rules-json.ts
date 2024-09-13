import { resolve } from 'path';
import type { AddFunc } from '@/cfg/types';

export const addJSONRules: AddFunc = async function (cfg, webpackCfg) {
  const { useLangJsonPicker, isSP, entry } = cfg.config;

  if (!useLangJsonPicker || isSP) return;

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

  webpackCfg.experiments = {
    layers: true,
  };
  webpackCfg.module.rules.push({
    test: /\.json$/,
    type: 'javascript/auto',
    oneOf: list,
  });
};
