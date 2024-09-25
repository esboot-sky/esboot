// import { rspack } from '@rspack/core';

import { Bundler } from '@dz-web/esboot';

// import { getRspackCfg } from './cfg';

export class BundlerRspack extends Bundler {
  async dev() {
    // const rspackCfg = await getRspackCfg(this.cfg);
    // const compiler = rspack(rspackCfg);
    // const watching = compiler.watch(
    //   {
    //     // Example
    //     aggregateTimeout: 300,
    //     poll: undefined,
    //   },
    //   (err, stats) => {
    //     // Print watch/build result here...
    //     console.log(stats);
    //   }
    // );
  }

  async build() {
    // const rspackCfg = await getRspackCfg(this.cfg);
    // const compiler = rspack(rspackCfg);

    // compiler.run((err, stats) => {
    //   // ...

    //   compiler.close((closeErr) => {
    //     // ...
    //   });
    // });
  }
}

export type { BundlerRspackOptions } from './types.ts';
