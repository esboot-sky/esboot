import { resolve } from 'path';
import { DEFAULT_OUTPUT_PATH } from '@dz-web/esboot-common/constants';
import type { ConfigurationInstance } from '@dz-web/esboot';
import Config from 'webpack-5-chain';

export const addOutput = async (
  cfg: ConfigurationInstance,
  webpackChain: Config
) => {
  const { cwd, isDev, publicPath, outputPath } = cfg.config;

  webpackChain.output
    .clean(!isDev)
    .publicPath(publicPath)
    .path(resolve(cwd, outputPath || DEFAULT_OUTPUT_PATH))
    .filename(isDev ? 'js/[name].js' : 'js/[name].[chunkhash:5].js');
};
