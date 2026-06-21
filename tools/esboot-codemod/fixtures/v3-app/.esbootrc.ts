import { defineConfig } from '@dz-web/esboot';
import { BundlerVite as Bundler } from '@dz-web/esboot-bundler-vite';

export default defineConfig({
  bundler: Bundler,
  isSP: false,
  alias: {
    '@@': 'src',
  },
  server: {
    port: '14200',
    http2: false,
  },
});
