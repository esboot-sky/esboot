import { createServer } from 'vite';
import { Bundler } from '@dz-web/esboot';
import react from '@vitejs/plugin-react';

// import type { BundlerViteOptions } from './Options/types.ts';

export class BundlerVite implements Bundler {
  constructor(Options: any) {
    console.log(Options, '<-- Options');
  }

  async dev() {
    console.log(__dirname, '<-- __dirname');
    const server = await createServer({
      plugins: [react()],
      configFile: false,
      root: process.cwd(),
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
