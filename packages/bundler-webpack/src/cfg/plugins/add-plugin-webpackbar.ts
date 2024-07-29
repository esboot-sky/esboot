import WebpackBar from 'webpackbar';
import type { ConfigurationInstance } from '@dz-web/esboot';
import Config from 'webpack-5-chain';

export const addWebpackbarPlugin = async (
  cfg: ConfigurationInstance,
  webpackChain: Config
) => {
  const { analyze } = cfg.config;

  webpackChain
    .plugin('webpack-bar')
    .use(WebpackBar, [
      {
        name: 'ESBoot',
        color: 'magenta',
        fancy: true,
        basic: true,
        profile: analyze,
        reporters: [
          'fancy',
          analyze && 'profile',
          {
            afterAllDone() {},
          },
        ].filter(Boolean) as any[],
      },
    ])
    .end();
};
