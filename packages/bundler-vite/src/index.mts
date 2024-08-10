import { createServer } from 'vite';
import { Bundler } from '@dz-web/esboot';
import { error } from '@dz-web/esboot-common/helpers';
import { BaseBundlerOptions, ConfigurationInstance } from '@dz-web/esboot';

import { getDevServer } from './cfg/get-dev-server.mts';

export class BundlerVite implements Bundler {
  cfg: ConfigurationInstance;

  constructor(options: BaseBundlerOptions) {
    this.cfg = options.configuration;
  }

  async dev() {
    const cfg = await getDevServer(this.cfg);

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
