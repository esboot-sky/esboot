// @vitest-environment node
import { BundlerVite } from '@dz-web/esboot-bundler-vite';
import { BundlerWebpack } from '@dz-web/esboot-bundler-webpack';
import { describe, expect, it } from 'vitest';

import viteConfigFactory from '../../esbootrc/vite.ts';
import webpackConfigFactory from '../../esbootrc/webpack.ts';

function resolveConfig(
  config: Record<string, any> | ((cfg: Record<string, any>) => Record<string, any>),
) {
  if (typeof config === 'function') {
    return config({
      isMobile: false,
      isBrowser: true,
    });
  }

  return config;
}

function getPluginNames(plugins: Array<{ name?: string }> = []) {
  return plugins.map(plugin => plugin.name);
}

describe('mp-base esbootrc contracts', () => {
  it('keeps vite and webpack configs wired for plugin-vitest and granular chunking', () => {
    const viteConfig = resolveConfig(viteConfigFactory);
    const webpackConfig = resolveConfig(webpackConfigFactory);

    expect(viteConfig.bundler).toBe(BundlerVite);
    expect(webpackConfig.bundler).toBe(BundlerWebpack);

    for (const config of [viteConfig, webpackConfig]) {
      const pluginNames = getPluginNames(config.plugins);
      const vitestPlugin = config.plugins?.find(
        plugin => plugin.name === 'plugin-vitest',
      ) as Record<string, any> | undefined;

      expect(pluginNames).toContain('plugin-vitest');
      expect(vitestPlugin?.__esbootPluginVitestOptions?.customConfig).toBeTypeOf('function');
    }

    expect(viteConfig.alias).toEqual({ '@@': 'src' });
    expect(viteConfig.sourceMap).toBe(false);
    expect(viteConfig.bundlerOptions.codeSplitting.jsStrategyOptions.frameworkBundles).toContain('dayjs');
    expect(viteConfig.px2rem).toEqual({
      enable: true,
      rootValue: 16,
    });
    expect(webpackConfig.bundlerOptions.codeSplitting.jsStrategyOptions.frameworkBundles).toContain('@dz-web/bridge');
    expect(webpackConfig.px2rem).toEqual({
      enable: true,
      rootValue: 16,
    });
  });
});
