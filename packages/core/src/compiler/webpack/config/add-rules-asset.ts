import { ApplyOpts } from './types';

export async function addAssetRules(applyOpts: ApplyOpts) {
  const { config } = applyOpts;

  config.module.rules.push(
    {
      test: /\.(jpg|gif|png|ico|svg)$/,
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
