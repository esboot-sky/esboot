import { Bundler } from '@dz-web/esboot';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import type { BundlerViteCfg } from './cfg/types';

export class BundlerVite implements Bundler {
  constructor(cfg: BundlerViteCfg) {
    console.log(cfg, '<-- cfg');
  }

  async dev() {
    const server = await createServer({
      plugins: [react()],
      configFile: false,
      root: __dirname,
      server: {
        port: 1337,
      },
    });

    await server.listen();
    server.printUrls();
    server.bindCLIShortcuts({ print: true });
  }

  build() {
    console.log(1, '<-- build');
  }
}

export * from './types';
export * from './cfg';
