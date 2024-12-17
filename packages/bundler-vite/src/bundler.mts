import { createServer } from 'vite';
import { Bundler } from '@dz-web/esboot';
import { error } from '@dz-web/esboot-common/helpers';
import { Environment } from '@dz-web/esboot-common/constants';

import { getDevCfg } from './cfg/get-dev-cfg.mts';

export class BundlerVite extends Bundler {
  name = 'vite';

  getName() {
    return this.name;
  }

  async dev() {
    const cfg = await getDevCfg(this.cfg, Environment.dev);

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
