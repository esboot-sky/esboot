import { resolve } from 'path';
import type { AddFunc } from '@/cfg/types';

import type { MFSU } from '@/cfg/helpers/mfsu';

export const addJSONRules: AddFunc<{ mfsu: MFSU }> = async function (
  cfg,
  webpackCfg,
  options
) {
  const { useLangJsonPicker, isSP, entry } = cfg.config;
  const { mfsu } = options!;

  if (!useLangJsonPicker || isSP || mfsu) return;

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
