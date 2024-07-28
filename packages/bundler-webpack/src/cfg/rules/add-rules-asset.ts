import type { ConfigurationInstance } from '@dz-web/esboot';
import { merge } from '@dz-web/esboot-common/lodash';
import Config from 'webpack-5-chain';

const parser = {
  dataUrlCondition: {
    maxSize: 8 * 1024, // 8 KB
  },
};
const filename = 'images/[name].[hash:8][ext]';

export async function addAssetRules(
  cfg: ConfigurationInstance,
  webpackChain: Config
) {
  const { svgr, svgrOptions = {} } = cfg.config;

  webpackChain.module
    .rule('images')
    .test(/\.(jpg|gif|png|ico)$/)
    .type('asset')
    .parser(parser)
    .generator({
      filename,
    });

  const svgRule = webpackChain.module.rule('svg').test(/\.svg$/i);

  svgRule
    .oneOf('svg-url')
    .resourceQuery(/url/) // *.svg?url
    .type('asset')
    .parser(parser)
    .generator({
      filename,
    });

  svgRule.oneOf('svg-component').when(
    svgr,
    (rule) => {
      rule
        .issuer(/\.[jt]sx?$/)
        .resourceQuery({ not: [/url/] })
        .use('@svgr/webpack')
        .loader(require.resolve('@svgr/webpack'))
        .options(
          merge(
            {
              icon: true,
              typescript: true,
              ext: 'tsx',
              svgoConfig: {},
            },
            svgrOptions
          )
        );
    },
    (rule) => {
      rule
        .oneOf('svg-source')
        .test(/_svg\.svg$/)
        .type('asset/source')
        .parser(parser)
        .generator({
          encoding: false,
          filename,
        });

      rule.oneOf('svg-default').type('asset').parser(parser).generator({
        filename,
      });
    }
  );
}
