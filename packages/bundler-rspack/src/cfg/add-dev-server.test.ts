import { beforeEach, describe, expect, it, vi } from 'vitest';

const logDevServer = vi.fn();

vi.mock('@dz-web/esboot-bundler-common', () => ({
  logDevServer,
}));

describe('rspack dev server config', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates dev server config for development builds', async () => {
    const { addDevServer } = await import('./add-dev-server');
    const rspackCfg: Record<string, any> = {};

    await addDevServer({
      config: {
        isDev: true,
        server: {
          port: 4000,
          open: false,
          host: '',
          proxy: { '/api': 'http://localhost:8080' },
          http2: true,
          https: false,
        },
      },
    } as any, rspackCfg);

    expect(rspackCfg.devServer.port).toBe(4000);
    expect(rspackCfg.devServer.server).toBe('spdy');
    expect(rspackCfg.devServer.host).toBe('0.0.0.0');
    expect(rspackCfg.devServer.proxy).toEqual({ '/api': 'http://localhost:8080' });
    expect(rspackCfg.devServer.setupMiddlewares(['base'])).toEqual(['base']);

    rspackCfg.devServer.onListening({
      server: {
        address: () => ({ port: 4000 }),
      },
    });
    expect(logDevServer).toHaveBeenCalledWith({
      port: 4000,
      isHttps: true,
      ip: undefined,
    });
  });
});
