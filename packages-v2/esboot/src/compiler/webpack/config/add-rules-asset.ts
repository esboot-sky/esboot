import { ApplyOpts } from './types';
import { merge } from 'lodash';

export async function addAssetRules(applyOpts: ApplyOpts) {
  const {
    config,
    userOpts: { svgr, svgrOptions = {} },
  } = applyOpts;

  config.module.rules.push({
    test: /\.(jpg|gif|png|ico)$/,
    type: 'asset',
    parser: {
      dataUrlCondition: {
        maxSize: 8 * 1024,
      },
    },
    generator: {
      filename: 'images/[name].[hash:8][ext]',
    },
  });

  if (svgr) {
    config.module.rules.push(
      {
        test: /\.svg$/i,
        type: 'asset',
        resourceQuery: /url/, // *.svg?url
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
        generator: {
          filename: 'images/[name].[hash:8][ext]',
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
    config.module.rules.push(
      {
        test: /\.(svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
        generator: {
          filename: 'images/[name].[hash:8][ext]',
        },
      },
      {
        test: /_svg\.svg$/,
        type: 'asset/source',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
        generator: {
          encoding: false,
          filename: 'images/[name].[hash:8][ext]',
        },
      }
    );
  }
}
