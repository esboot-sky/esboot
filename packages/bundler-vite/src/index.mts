import { createServer } from 'vite';
import { Bundler, BaseBundlerOptions } from '@dz-web/esboot';
import { error } from '@dz-web/esboot-common/helpers';

import { getDevCfg } from './cfg/get-dev-cfg.mts';

export class BundlerVite extends Bundler {
  name = 'vite';

  constructor(options: BaseBundlerOptions) {
    super(options);
  }

  getName() {
    return this.name;
  }

  async dev() {
    const cfg = await getDevCfg(this.cfg);

    const server = await createServer(cfg);

    await server.listen();
    server.printUrls();
    server.bindCLIShortcuts({ print: true });
  }

  build() {
    error('Not implemented yet, use webpack bundler instead.');
  }
}

export type { BundlerViteOptions } from './types.mts';
