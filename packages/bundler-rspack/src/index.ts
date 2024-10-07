import { rspack } from '@rspack/core';
import { error, warn } from '@dz-web/esboot-common/helpers';
import { RspackDevServer } from '@rspack/dev-server';

import { Bundler, type BaseBundlerOptions } from '@dz-web/esboot';

import { getRspackCfg } from './cfg';

export class BundlerRspack extends Bundler {
  name = 'rspack';

  constructor(options: BaseBundlerOptions) {
    super(options);
  }

  getName() {
    return this.name;
  }

  async dev() {
    const rspackCfg = await getRspackCfg(this.cfg);
    const compiler = rspack(rspackCfg);

    const devServer = new RspackDevServer(rspackCfg.devServer, compiler);

    devServer.start();
    // devServer.listen(8080, 'localhost', () => {
    //   console.log('dev server listening on port 8080');
    // });
  }

  async build() {
    const rspackCfg = await getRspackCfg(this.cfg);
    const compiler = rspack(rspackCfg);

    compiler.run((err, stats) => {
      if (err) {
        console.error(err.stack || err);
        return;
      }

      const info = stats?.toJson();

      if (stats?.hasErrors()) {
        for (const err of info?.errors ?? []) {
          error(err.message);
        }
      }

      if (stats?.hasWarnings()) {
        for (const _warn of info?.warnings ?? []) {
          warn(_warn.message);
        }
      }

      compiler.close((closeErr) => {
        if (closeErr) {
          console.error(closeErr);
          process.exit(1);
        }
      });
    });
  }
}

export type { BundlerRspackOptions } from './types.ts';
