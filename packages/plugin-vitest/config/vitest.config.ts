/// <reference types="vitest" />
// import { defineConfig, configDefaults, mergeConfig } from 'vitest/config';
import { processPrepare, loadEnv, cfg } from '@dz-web/esboot';
import { Environment } from '@dz-web/esboot-common/constants';
import { omit } from '@dz-web/esboot-common/lodash';
import { getDevCfg } from '@dz-web/esboot-bundler-vite';
import react from '@vitejs/plugin-react';
import { join } from 'path';

import { alias } from '../dist';

export default async () => {
  const { defineConfig } = await import('vitest/config');
  const root = process.cwd();

  processPrepare();
  loadEnv({ root });
  cfg.load({ cwd: root });

  let viteConfig: any = await getDevCfg(cfg, Environment.test);

  viteConfig.resolve.alias = {
    ...viteConfig.resolve.alias,
    ...alias,
  };
  viteConfig = omit(viteConfig, [
    'configFile',
    'entry',
    'publicDir',
    'plugins',
  ]);

  console.log(viteConfig, 'viteConfig223');

  return defineConfig({
    // plugins: [react()],
    test: {
      // include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
      include: ['src/**/*.test.ts'],
      // forceRerunTriggers: [
      //   ...configDefaults.forceRerunTriggers,
      //   '**/*.test.{ts,tsx}',
      //   '**/*.{ts,tsx}',
      // ],
      setupFiles: [join(__dirname, './setup.ts')],
      environment: 'jsdom',
      alias: viteConfig.resolve.alias,
    },
  });
  // return mergeConfig(
  //   viteConfig,
  //   defineConfig({
  //     plugins: [react()],
  //     test: {
  //       include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
  //       forceRerunTriggers: [
  //         ...configDefaults.forceRerunTriggers,
  //         '**/*.test.{ts,tsx}',
  //         '**/*.{ts,tsx}',
  //       ],
  //       setupFiles: [join(__dirname, './setup.ts')],
  //       environment: 'jsdom',
  //       // globals: true,
  //     },
  //   })
  // );
};
