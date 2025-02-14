import { defineConfig } from '@dz-web/esboot';
import { BundlerVite } from '@dz-web/esboot-bundler-vite';
import type { BundlerViteOptions } from '@dz-web/esboot-bundler-vite';

export default defineConfig<BundlerViteOptions>(() => ({
  isSP: true,
  bundler: BundlerVite,
}));
