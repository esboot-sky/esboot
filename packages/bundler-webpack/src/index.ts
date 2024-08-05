import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { Bundler } from '@dz-web/esboot';
import { BaseBundlerOptions, ConfigurationInstance } from '@dz-web/esboot';
import { error } from '@dz-web/esboot-common/helpers';
import kleur from '@dz-web/esboot-common/kleur';

import { getWebpackCfg } from './cfg';

export class BundlerWebpack implements Bundler {
  cfg: ConfigurationInstance;

  constructor(options: BaseBundlerOptions) {
    this.cfg = options.configuration;
  }

  async dev() {
    let server: WebpackDevServer;
    const start = async () => {
      console.time('dev');
      const webpackCfg = await getWebpackCfg(this.cfg);

      const compiler = Webpack(webpackCfg);
      console.timeEnd('dev');

      server = new WebpackDevServer(webpackCfg.devServer, compiler);

      try {
        await server.start();
      } catch (err) {
        error(err);
      }
    };

    await start();
  }

  async build() {
    const webpackCfg = await getWebpackCfg(this.cfg);
    const compiler = Webpack(webpackCfg);

    const handler: Parameters<typeof compiler.run>[0] = async (err, stats) => {
      const statsJson = stats?.toJson('minimal');
      const errors = statsJson?.errors ?? [];
      const errorsCount = statsJson?.errorsCount ?? 0;
      // const warnings = statsJson?.warnings ?? [];

      if (err || stats?.hasErrors()) {
        console.error(
          kleur.red().bold(`Failed to compile with ${errorsCount} errors \n`)
        );

        errors.forEach((err, index) => {
          const { message, moduleName = '', loc = '' } = err;
          console.log(
            `${kleur.bgRed().bold(` ERROR ${index + 1} `)} in ${kleur.white(
              moduleName
            )} ${kleur.green(loc)} \n`
          );
          console.log(`${message} \n`);
        });

        process.exit(1);
      }

      // if (stats?.hasWarnings()) {
      // }

      compiler.close(() => {});
    };

    compiler.watch({}, handler);
  }
}

export * from './types';
