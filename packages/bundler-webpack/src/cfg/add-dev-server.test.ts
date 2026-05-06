import { beforeEach, describe, expect, it, vi } from 'vitest';

const logDevServer = vi.fn();

vi.mock('@dz-web/esboot-bundler-common', () => ({
  logDevServer,
}));

describe('webpack dev server config', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates dev server config and prepends mfsu middlewares', async () => {
    const { addDevServer } = await import('./add-dev-server');
    const webpackCfg: Record<string, any> = {};
    const mfsu = {
      getMiddlewares: () => ['m1', 'm2'],
    };

    await addDevServer({
      config: {
        isDev: true,
        server: {
          port: 3000,
          open: true,
          host: '127.0.0.1',
          proxy: { '/api': 'http://localhost:8080' },
          http2: false,
          https: false,
        },
      },
    } as any, webpackCfg, { mfsu } as any);

    expect(webpackCfg.devServer.port).toBe(3000);
    expect(webpackCfg.devServer.proxy).toEqual({ '/api': 'http://localhost:8080' });
    expect(webpackCfg.devServer.setupMiddlewares(['base'])).toEqual(['m1', 'm2', 'base']);

    webpackCfg.devServer.onListening({
      server: {
        address: () => ({ port: 3000 }),
      },
    });
    expect(logDevServer).toHaveBeenCalledWith({
      port: 3000,
      isHttps: false,
      ip: undefined,
    });
  });
});
