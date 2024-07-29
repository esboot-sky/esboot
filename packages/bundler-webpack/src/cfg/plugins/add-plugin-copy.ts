import CopyPlugin from 'copy-webpack-plugin';
import { pathExistsSync } from '@dz-web/esboot-common/fs-extra';
import type { ConfigurationInstance } from '@dz-web/esboot';
import Config from 'webpack-5-chain';

export const addCopyPlugin = async (
  cfg: ConfigurationInstance,
  webpackChain: Config
) => {
  const { staticPathList } = cfg.config;

  const filteredStaticPathList = staticPathList.filter((item) =>
    pathExistsSync(item.from)
  );

  webpackChain
    .plugin('copy-plugin')
    .use(CopyPlugin, [
      {
        patterns: [...filteredStaticPathList],
      },
    ])
    .end();
};
