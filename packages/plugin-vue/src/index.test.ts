import { describe, expect, it, vi } from 'vitest';
import pluginVue from './index';

const { vue, vueJsx, vueDevTools } = vi.hoisted(() => ({
  vue: vi.fn(() => ({ name: 'vite:vue' })),
  vueJsx: vi.fn(() => ({ name: 'vite:vue-jsx' })),
  vueDevTools: vi.fn(() => ({ name: 'vite:vue-devtools' })),
}));

vi.mock('@vitejs/plugin-vue', () => ({
  default: vue,
}));

vi.mock('@vitejs/plugin-vue-jsx', () => ({
  default: vueJsx,
}));

vi.mock('vite-plugin-vue-devtools', () => ({
  default: vueDevTools,
}));

describe('is a plugin', () => {
  it('should be a function', () => {
    expect(pluginVue).toBeInstanceOf(Function);
  });

  it('should return the correct plugin', () => {
    const plugin = pluginVue();

    expect(plugin).toBeDefined();
    expect(plugin.key).toBe('plugin-vue');
  });

  it('adds vue-specific plugins and removes react plugins for vite bundler config', () => {
    const plugin = pluginVue({
      vueDevToolsOptions: { enable: true },
      jsxOptions: { enable: true },
    });

    const bundlerConfig = {
      plugins: [{ name: 'vite:react-babel' }, { name: 'custom' }],
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              framework: ['react', 'react-dom', 'lodash-es'],
            },
          },
        },
      },
    };

    plugin.modifyBundlerConfig?.({} as any, bundlerConfig as any, 'vite');

    expect(vue).toHaveBeenCalled();
    expect(vueDevTools).toHaveBeenCalled();
    expect(vueJsx).toHaveBeenCalled();
    expect(bundlerConfig.plugins[0]).toEqual({ name: 'vite:vue' });
    expect(bundlerConfig.plugins).not.toContainEqual({ name: 'vite:react-babel' });
    expect(bundlerConfig.build.rollupOptions.output.manualChunks.framework).toEqual(['vue', 'lodash-es']);
  });

  it('throws for unsupported bundlers', () => {
    const plugin = pluginVue();

    expect(() => plugin.modifyBundlerConfig?.({} as any, {} as any, 'webpack')).toThrow(
      'Plugin Vue is not supported for webpack now, please use vite instead.',
    );
  });
});
