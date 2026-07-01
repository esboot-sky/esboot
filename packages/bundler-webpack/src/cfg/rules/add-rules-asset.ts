import type { AddFunc } from '@/cfg/types';
import { resolvePathFromUrl } from '@dz-web/esboot-common/helpers';
import { getSvgrOptions } from '@dz-web/esboot-bundler-common';

const filename = 'images/[name].[hash:8][ext]';

export const addAssetRules: AddFunc = async (cfg, webpackCfg) => {
  const { svgr, svgrOptions = {}, assetsInlineLimit } = cfg.config;

  const parser = {
    dataUrlCondition: {
      maxSize: assetsInlineLimit,
    },
  };

  webpackCfg.module.rules.push({
    test: /\.(jpg|gif|png|ico|webp)$/,
    type: 'asset',
    parser,
    generator: {
      filename,
    },
  });

  if (svgr) {
    webpackCfg.module.rules.push(
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
            loader: resolvePathFromUrl('@svgr/webpack', import.meta.resolve),
            options: getSvgrOptions(svgrOptions, {
              typescript: true,
              ext: 'tsx',
            }),
          },
        ],
      },
    );
  }
  else {
    webpackCfg.module.rules.push(
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
      },
    );
  }
};
