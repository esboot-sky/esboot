import { rspack } from '@rspack/core';

import { Bundler } from '@dz-web/esboot';

export class BundlerRSPack implements Bundler {
  constructor(Options: any) {
    console.log(Options, '<-- Options');
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
