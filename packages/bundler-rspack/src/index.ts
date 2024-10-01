import { rspack } from '@rspack/core';
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
    const watching = compiler.watch(
      {
        // Example
        aggregateTimeout: 300,
        poll: undefined,
      },
      (err, stats) => {
        if (err) {
          console.error(err);
        }
        // Print watch/build result here...
        // console.log(stats);
      }
    );
  }
}

export type { BundlerRspackOptions } from './types.ts';
