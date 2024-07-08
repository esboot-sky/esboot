import { rspack } from '@rspack/core';

import { Bundler } from '@dz-web/esboot';

export class BundlerRSPack implements Bundler {
  constructor(cfg: any) {
    console.log(cfg, '<-- cfg');
  }

  async dev() {
    const compiler = rspack({});

    compiler.run((err, stats) => {
      // ...

      compiler.close((closeErr) => {
        // ...
      });
    });
  }

  build() {
    console.log(1, '<-- build');
  }
}
