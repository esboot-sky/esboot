import { rspack } from '@rspack/core';

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
    console.log(rspackCfg);
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
