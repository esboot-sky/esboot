import { createServer } from 'vite';
import { Bundler } from '@dz-web/esboot';
import react from '@vitejs/plugin-react';

import { BaseBundlerOptions, ConfigurationInstance } from '@dz-web/esboot';

export class BundlerVite implements Bundler {
  cfg: ConfigurationInstance;

  constructor(options: BaseBundlerOptions) {
    this.cfg = options.configuration;
  }

  async dev() {
    const { cwd } = this.cfg.config;

    console.log(__dirname, '<-- __dirname');
    const server = await createServer({
      plugins: [react()],
      configFile: false,
      root: cwd,
      resolve: {
        alias: {
          '@': '/src',
        },
      },
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

export * from './types.ts';
