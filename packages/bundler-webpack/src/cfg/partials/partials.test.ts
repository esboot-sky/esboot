import { describe, expect, it, vi } from 'vitest';

const ReactRefreshWebpackPlugin = vi.fn(function MockPlugin(this: Record<string, unknown>, options: unknown) {
  this.options = options;
});

vi.mock('@pmmmwh/react-refresh-webpack-plugin', () => ({
  default: ReactRefreshWebpackPlugin,
}));

describe('webpack cfg partials', () => {
  it('uses source-map when sourceMap is enabled', async () => {
    const { addDevtool } = await import('./add-devtool');
    const webpackCfg: Record<string, unknown> = {};

    await addDevtool({ config: { isDev: true, sourceMap: true } } as any, webpackCfg as any);

    expect(webpackCfg.devtool).toBe('source-map');
  });

  it('uses eval cheap devtool during development when sourceMap is disabled', async () => {
    const { addDevtool } = await import('./add-devtool');
    const webpackCfg: Record<string, unknown> = {};

    await addDevtool({ config: { isDev: true, sourceMap: false } } as any, webpackCfg as any);

    expect(webpackCfg.devtool).toBe('eval-cheap-module-source-map');
  });

  it('writes output config with hashed filenames in production', async () => {
    const { addOutput } = await import('./add-output');
    const webpackCfg: Record<string, any> = {};

    await addOutput({
      config: {
        cwd: '/repo/app',
        isDev: false,
        publicPath: '/static/',
        outputPath: 'build',
      },
    } as any, webpackCfg);

    expect(webpackCfg.output).toEqual({
      publicPath: '/static/',
      clean: true,
      path: '/repo/app/build',
      filename: 'js/[name].[chunkhash:8].js',
    });
  });

  it('adds dev-only stats and react refresh plugin in development', async () => {
    const { addOnlyDev } = await import('./add-only-dev');
    const webpackCfg = {
      plugins: [],
    };

    await addOnlyDev({ config: { isDev: true } } as any, webpackCfg as any);

    expect(webpackCfg.stats).toBe('errors-only');
    expect(webpackCfg.infrastructureLogging).toEqual({ level: 'error' });
    expect(ReactRefreshWebpackPlugin).toHaveBeenCalledWith({ overlay: false });
    expect(webpackCfg.plugins).toHaveLength(1);
  });
});
