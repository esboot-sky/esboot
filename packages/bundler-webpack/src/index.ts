import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { Bundler } from '@dz-web/esboot';
import { BaseBundlerOptions } from '@dz-web/esboot';
import { error } from '@dz-web/esboot-common/helpers';
import kleur from '@dz-web/esboot-common/kleur';

import { getWebpackCfg } from './cfg';
import type { CustomWebpackConfiguration } from '@/cfg/types';

export class BundlerWebpack extends Bundler {
  name = 'webpack';

  constructor(options: BaseBundlerOptions) {
    super(options);
  }

  getName() {
    return this.name;
  }

  async dev() {
    let server: WebpackDevServer;
    const start = async () => {
      console.time('Create config');
      const webpackCfg = this.onModifyBundlerConfig<CustomWebpackConfiguration>(
        await getWebpackCfg(this.cfg)
      );
      console.timeEnd('Create config');

      const compiler = Webpack(webpackCfg);

      server = new WebpackDevServer(webpackCfg.devServer, compiler);

      try {
        await server.start();
      } catch (err) {
        error(err);
      }
    };

    await start();
    this.onAfterCompile();
  }

  async build() {
    const webpackCfg = this.onModifyBundlerConfig<CustomWebpackConfiguration>(
      await getWebpackCfg(this.cfg)
    );
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

      compiler.close(() => {
        this.onAfterCompile();
      });
    };

    compiler.watch({}, handler);
  }
}

export * from './types';
