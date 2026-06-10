// @vitest-environment node
import { BundlerVite } from '@dz-web/esboot-bundler-vite';
import { BundlerWebpack } from '@dz-web/esboot-bundler-webpack';
import { describe, expect, it } from 'vitest';

import viteConfig from '../../esbootrc/vite.ts';
import webpackConfig from '../../esbootrc/webpack.ts';

function getPluginNames(plugins: Array<{ name?: string }> = []) {
  return plugins.map(plugin => plugin.name);
}

describe('sp-base esbootrc contracts', () => {
  it('wires vitest into vite and webpack example configs', () => {
    expect(viteConfig.bundler).toBe(BundlerVite);
    expect(webpackConfig.bundler).toBe(BundlerWebpack);

    for (const config of [viteConfig, webpackConfig]) {
      const pluginNames = getPluginNames(config.plugins);

      expect(pluginNames).toContain('plugin-vitest');
      expect(pluginNames).toContain('plugin-tailwind3');
      expect(pluginNames).toContain('plugin-docs');

      const vitestPlugin = config.plugins?.find(
        plugin => plugin.name === 'plugin-vitest',
      ) as Record<string, any> | undefined;
      expect(vitestPlugin?.__esbootPluginVitestOptions?.customConfig).toBeTypeOf('function');
    }
  });

  it('keeps vite and webpack example aliases and styleName contracts intact', () => {
    expect(viteConfig.alias).toEqual({ '@@': 'src' });
    expect(viteConfig.css?.modules?.useStyleName).toBe(true);
    expect(webpackConfig.alias).toEqual({ '@@': 'src' });
    expect(webpackConfig.isSP).toBe(true);
  });
});
