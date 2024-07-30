import Webpack, { type Configuration } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { Bundler } from '@dz-web/esboot';
import { BaseBundlerOptions, ConfigurationInstance } from '@dz-web/esboot';
import { error } from '@dz-web/esboot-common/helpers';

import { getWebpackCfg } from './cfg';

export class BundlerWebpack implements Bundler {
  cfg: ConfigurationInstance;

  constructor(options: BaseBundlerOptions) {
    this.cfg = options.configuration;
  }

  async dev() {
    let server: WebpackDevServer;
    // const webpackCfg = await getWebpackCfg(this.cfg);
    // console.log(webpackCfg.toConfig(), '<-- dev');

    const start = async () => {
      console.time('dev');
      const webpackCfg = await getWebpackCfg(this.cfg);
      
      console.log(webpackCfg, '<-- webpackCfg');
      return;
      // const compiler = Webpack(webpackCfg);
      // console.timeEnd('dev');

      // logBrand();
      server = new WebpackDevServer(webpackCfg.devServer, compiler);

      try {
        await server.start();
      } catch (err) {
        error(err);
      }
    };

    start();
  }

  build() {
    console.log(1, '<-- build');
  }
}

export * from './types';
export * from './options';
