import { processPrepare, loadEnv, cfg } from '@dz-web/esboot';
import { Environment } from '@dz-web/esboot-common/constants';
import { omit } from '@dz-web/esboot-common/lodash';
import {
  getCfg,
  type CustomViteConfiguration,
} from '@dz-web/esboot-bundler-vite';
import { join } from 'node:path';
import { defineConfig, configDefaults, mergeConfig } from 'vitest/config';

import { alias } from '../dist';

export default async () => {
  const root = process.cwd();

  processPrepare();
  loadEnv({ root });
  cfg.load({ cwd: root });

  let viteConfig: CustomViteConfiguration = await getCfg(cfg, Environment.test);

  viteConfig.resolve!.alias = {
    ...viteConfig.resolve!.alias,
    ...alias,
  };
  viteConfig = omit(viteConfig, ['configFile', 'build']);

  return mergeConfig(
    viteConfig,
    defineConfig({
      test: {
        include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
        forceRerunTriggers: [
          ...configDefaults.forceRerunTriggers,
          '**/*.test.{ts,tsx}',
          '**/*.{ts,tsx}',
        ],
        setupFiles: [join(__dirname, './setup.ts')],
        environment: 'jsdom',
        // globals: true,
      },
    })
  );
};
