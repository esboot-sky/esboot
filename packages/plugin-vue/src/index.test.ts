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
    expect(plugin.name).toBe('plugin-vue');
  });

  it('registers a framework provider that owns vue-specific bundler behavior', () => {
    const plugin = pluginVue({
      vueDevToolsOptions: { enable: true },
      jsxOptions: { enable: true },
    });

    const cfg = {
      bundlerOptions: {
        codeSplitting: {
          jsStrategyOptions: {
            frameworkBundles: ['react', 'react-dom', 'lodash-es'],
          },
        },
      },
      svgrOptions: {
        plugins: [],
      },
    };

    const nextCfg = plugin.modifyConfig?.(cfg as any, {} as any);
    const frameworkProvider = nextCfg?.bundlerOptions?.frameworkProvider;

    expect(nextCfg).toEqual(expect.objectContaining({
      bundlerOptions: expect.objectContaining({
        frameworkProvider: expect.any(Object),
      }),
    }));
    expect(frameworkProvider.useReactStyleNamePlugin).toBe(false);
    expect(frameworkProvider.transformFrameworkBundles(['react', 'react-dom', 'lodash-es'])).toEqual([
      'vue',
      'lodash-es',
    ]);
    expect(vue).not.toHaveBeenCalled();
    expect(vueDevTools).not.toHaveBeenCalled();
    expect(vueJsx).not.toHaveBeenCalled();
    expect(frameworkProvider.getPlugins({ target: 'vite' })).toEqual([
      { name: 'vite:vue' },
      { name: 'vite:vue-devtools' },
      { name: 'vite:vue-jsx' },
    ]);
    expect(frameworkProvider.getPlugins({ target: 'vitest' })).toEqual([
      { name: 'vite:vue' },
      { name: 'vite:vue-jsx' },
    ]);
  });
});
