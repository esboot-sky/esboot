import { merge } from '@dz-web/esboot-common/lodash';

import type { AddFunc } from '@/cfg/types';

const parser = {
  dataUrlCondition: {
    maxSize: 8 * 1024, // 8 KB
  },
};
const filename = 'images/[name].[hash:8][ext]';

export const addAssetRules: AddFunc = async (cfg, rspackCfg) => {
  const { svgr, svgrOptions = {} } = cfg.config;

  rspackCfg.module.rules.push({
    test: /\.(jpg|gif|png|ico)$/,
    type: 'asset',
    parser,
    generator: {
      filename,
    },
  });

  if (svgr) {
    rspackCfg.module.rules.push(
      {
        test: /\.svg$/i,
        type: 'asset',
        resourceQuery: /url/, // *.svg?url
        parser,
        generator: {
          filename,
        },
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: [/url/] }, // exclude react component if *.svg?url
        use: [
          {
            loader: require.resolve('@svgr/webpack'),
            options: merge(
              {
                icon: true,
                typescript: true,
                ext: 'tsx',
                svgoConfig: {},
              },
              svgrOptions
            ),
          },
        ],
      }
    );
  } else {
    rspackCfg.module.rules.push(
      {
        test: /\.(svg)$/,
        type: 'asset',
        parser,
        generator: {
          filename,
        },
      },
      {
        test: /_svg\.svg$/,
        type: 'asset/source',
        parser,
        generator: {
          encoding: false,
          filename,
        },
      }
    );
  }
};
