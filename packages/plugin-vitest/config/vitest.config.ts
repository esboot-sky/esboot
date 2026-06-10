import process from 'node:process';
import { cfg, processPrepare } from '@dz-web/esboot';
import { loadEnv } from '@dz-web/esboot-common/cfg';
import { mergeConfig } from 'vitest/config';

// eslint-disable-next-line antfu/no-import-dist
import { getPluginVitestOptions } from '../dist/options.js';
import { createVitestTestConfig, createVitestViteConfig } from './create-vitest-vite-config';

export default async () => {
  const root = process.cwd();

  processPrepare();
  loadEnv({ root });
  await cfg.load({ cwd: root });

  const pluginOptions = getPluginVitestOptions(cfg.config.plugins);

  if (cfg.config.bundler?.name === 'BundlerVite') {
    const { getCfg } = await import('@dz-web/esboot-bundler-vite');
    const viteConfig = await getCfg(cfg, 'test');
    const mergedConfig = mergeConfig(viteConfig, createVitestTestConfig());

    return pluginOptions.customConfig
      ? await pluginOptions.customConfig(mergedConfig as any, cfg.config)
      : mergedConfig;
  }

  return await createVitestViteConfig(cfg, pluginOptions);
};
