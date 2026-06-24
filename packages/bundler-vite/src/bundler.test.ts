import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  build,
  createViteServer,
  expressApp,
  expressFactory,
  getCfg,
  loadHtmlContent,
  hasSsgEnabledPages,
  renderSsgHtmlForPage,
  prerenderSsgPages,
  onAfterCompile,
  close,
  readFileSync,
} = vi.hoisted(() => ({
  build: vi.fn(),
  createViteServer: vi.fn(),
  expressApp: {
    listen: vi.fn(),
    use: vi.fn(),
  },
  expressFactory: vi.fn(),
  getCfg: vi.fn(),
  loadHtmlContent: vi.fn(),
  hasSsgEnabledPages: vi.fn(),
  renderSsgHtmlForPage: vi.fn(),
  prerenderSsgPages: vi.fn(),
  onAfterCompile: vi.fn(),
  close: vi.fn(),
  readFileSync: vi.fn(),
}));

vi.mock('node:fs', () => ({
  readFileSync,
}));

vi.mock('express', () => ({
  default: expressFactory,
}));

vi.mock('vite', () => ({
  build,
  createServer: createViteServer,
}));

vi.mock('./cfg/get-cfg', () => ({
  getCfg,
}));

vi.mock('./helpers/ssg', () => ({
  hasSsgEnabledPages,
  prerenderSsgPages,
  renderSsgHtmlForPage,
}));

vi.mock('./helpers/load-html-content', () => ({
  loadHtmlContent,
}));

describe('bundler vite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    expressFactory.mockReturnValue(expressApp);
    readFileSync.mockReturnValue('export default { title: "Client page" };');
    hasSsgEnabledPages.mockReturnValue(false);
    createViteServer.mockResolvedValue({
      middlewares: vi.fn(),
      ssrLoadModule: vi.fn(),
      transformIndexHtml: vi.fn(async (_url: string, html: string) => html),
      close,
    });
    getCfg.mockResolvedValue({
      root: '/repo/app',
      server: {
        host: '127.0.0.1',
        port: 4000,
      },
      build: {
        outDir: 'dist',
      },
      sharedConfig: {
        pages: {
          client: {
            entry: '/src/client.entry.tsx',
            sourceEntry: '/repo/app/src/client.entry.tsx',
            template: '/repo/app/config/template/index.html',
            title: 'Client',
          },
        },
      },
    });
    loadHtmlContent.mockResolvedValue('<html><body><div id="root"></div></body></html>');
    renderSsgHtmlForPage.mockImplementation(async ({ html }) => html);
  });

  it('skips creating an ssg server for pure csr builds', async () => {
    const { BundlerVite } = await import('./bundler');
    const bundler = new BundlerVite({
      configuration: {
        config: {
          cwd: '/repo/app',
          outputPath: 'dist',
        },
      },
      pluginHooksDict: {},
    } as any);

    bundler.onAfterCompile = onAfterCompile;

    await bundler.build();

    expect(build).toHaveBeenCalled();
    expect(createViteServer).not.toHaveBeenCalled();
    expect(prerenderSsgPages).not.toHaveBeenCalled();
    expect(close).not.toHaveBeenCalled();
    expect(onAfterCompile).toHaveBeenCalled();
  });

  it('builds and then prerenders ssg pages when at least one page enables ssg', async () => {
    getCfg.mockResolvedValue({
      root: '/repo/app',
      server: {
        host: '127.0.0.1',
        port: 4000,
      },
      build: {
        outDir: 'dist',
      },
      sharedConfig: {
        pages: {
          docs: {
            entry: '/src/docs.entry.tsx',
            sourceEntry: '/repo/app/src/docs.entry.tsx',
            template: '/repo/app/config/template/index.html',
            title: 'Docs',
          },
        },
      },
    });
    readFileSync.mockImplementation((id: string) => {
      if (id.endsWith('docs.entry.tsx')) {
        return 'export default { ssg: { enable: true, render: () => "<article>docs</article>" } };';
      }

      return 'export default { title: "Client page" };';
    });
    hasSsgEnabledPages.mockReturnValue(true);

    const { BundlerVite } = await import('./bundler');
    const bundler = new BundlerVite({
      configuration: {
        config: {
          cwd: '/repo/app',
          outputPath: 'dist',
        },
      },
      pluginHooksDict: {},
    } as any);

    bundler.onAfterCompile = onAfterCompile;

    await bundler.build();

    expect(build).toHaveBeenCalled();
    expect(createViteServer).toHaveBeenCalledWith(expect.objectContaining({
      appType: 'custom',
      optimizeDeps: expect.objectContaining({
        noDiscovery: true,
      }),
      server: expect.objectContaining({
        middlewareMode: true,
        hmr: false,
        ws: false,
      }),
    }));
    expect(prerenderSsgPages).toHaveBeenCalledWith(expect.objectContaining({
      outDir: '/repo/app/dist',
      pages: expect.objectContaining({
        docs: expect.objectContaining({
          sourceEntry: '/repo/app/src/docs.entry.tsx',
        }),
      }),
      loadModule: expect.any(Function),
      readHtml: expect.any(Function),
      writeHtml: expect.any(Function),
    }));
    expect(close).toHaveBeenCalled();
    expect(onAfterCompile).toHaveBeenCalled();
  });

  it('registers html route before vite middlewares so ssg pages are served in dev', async () => {
    const { BundlerVite } = await import('./bundler');
    const bundler = new BundlerVite({
      configuration: {
        config: {
          cwd: '/repo/app',
          outputPath: 'dist',
          server: {
            host: '127.0.0.1',
            port: 4000,
          },
        },
      },
      pluginHooksDict: {},
    } as any);

    bundler.onAfterCompile = onAfterCompile;

    await bundler.dev();

    expect(expressApp.use).toHaveBeenCalledTimes(2);
    expect(expressApp.use.mock.calls[0]?.[0]).toBe('/');
    expect(expressApp.use.mock.calls[1]?.[0]).toEqual(expect.any(Function));
    expect(expressApp.listen).toHaveBeenCalledWith(4000, '127.0.0.1', expect.any(Function));
  });

  it('skips the html handler for static asset requests in dev', async () => {
    const { BundlerVite } = await import('./bundler');
    const bundler = new BundlerVite({
      configuration: {
        config: {
          cwd: '/repo/app',
          outputPath: 'dist',
          server: {
            host: '127.0.0.1',
            port: 4000,
          },
        },
      },
      pluginHooksDict: {},
    } as any);

    bundler.onAfterCompile = onAfterCompile;

    await bundler.dev();

    const htmlRouteHandler = expressApp.use.mock.calls[0]?.[1];
    const next = vi.fn();
    const res = {
      status: vi.fn(),
      send: vi.fn(),
    };

    await htmlRouteHandler(
      {
        originalUrl: '/static/logo.svg',
        headers: {
          accept: 'text/html,application/xhtml+xml',
        },
      },
      res,
      next,
    );

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(loadHtmlContent).not.toHaveBeenCalled();
  });

  it('serves html pages under publicPath in dev', async () => {
    const { BundlerVite } = await import('./bundler');
    const bundler = new BundlerVite({
      configuration: {
        config: {
          cwd: '/repo/app',
          outputPath: 'dist',
          publicPath: '/public/',
          server: {
            host: '127.0.0.1',
            port: 4000,
          },
        },
      },
      pluginHooksDict: {},
    } as any);

    bundler.onAfterCompile = onAfterCompile;

    await bundler.dev();

    const htmlRouteHandler = expressApp.use.mock.calls[0]?.[1];
    const next = vi.fn();
    const res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    await htmlRouteHandler(
      {
        originalUrl: '/public/client.html',
        headers: {
          accept: 'text/html,application/xhtml+xml',
        },
      },
      res,
      next,
    );

    expect(loadHtmlContent).toHaveBeenCalledWith('client', expect.any(Object));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(next).not.toHaveBeenCalled();
  });

  it('skips the html handler for static assets under publicPath in dev', async () => {
    const { BundlerVite } = await import('./bundler');
    const bundler = new BundlerVite({
      configuration: {
        config: {
          cwd: '/repo/app',
          outputPath: 'dist',
          publicPath: '/public/',
          server: {
            host: '127.0.0.1',
            port: 4000,
          },
        },
      },
      pluginHooksDict: {},
    } as any);

    bundler.onAfterCompile = onAfterCompile;

    await bundler.dev();

    const htmlRouteHandler = expressApp.use.mock.calls[0]?.[1];
    const next = vi.fn();
    const res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    await htmlRouteHandler(
      {
        originalUrl: '/public/static/logo.svg',
        headers: {
          accept: 'text/html,application/xhtml+xml',
        },
      },
      res,
      next,
    );

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(loadHtmlContent).not.toHaveBeenCalled();
  });

  it('skips the html handler for html files under static paths in dev', async () => {
    const { BundlerVite } = await import('./bundler');
    const bundler = new BundlerVite({
      configuration: {
        config: {
          cwd: '/repo/app',
          outputPath: 'dist',
          publicPath: '/public/',
          server: {
            host: '127.0.0.1',
            port: 4000,
          },
        },
      },
      pluginHooksDict: {},
    } as any);

    bundler.onAfterCompile = onAfterCompile;

    await bundler.dev();

    const htmlRouteHandler = expressApp.use.mock.calls[0]?.[1];
    const next = vi.fn();
    const res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    await htmlRouteHandler(
      {
        originalUrl: '/public/static/test/index.html',
        headers: {
          accept: 'text/html,application/xhtml+xml',
        },
      },
      res,
      next,
    );

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(loadHtmlContent).not.toHaveBeenCalled();
  });

  it('uses publicPath in the not found page links in dev', async () => {
    const { BundlerVite } = await import('./bundler');
    const bundler = new BundlerVite({
      configuration: {
        config: {
          cwd: '/repo/app',
          outputPath: 'dist',
          publicPath: '/public/',
          server: {
            host: '127.0.0.1',
            port: 4000,
          },
        },
      },
      pluginHooksDict: {},
    } as any);

    bundler.onAfterCompile = onAfterCompile;

    await bundler.dev();

    const htmlRouteHandler = expressApp.use.mock.calls[0]?.[1];
    const next = vi.fn();
    const res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    await htmlRouteHandler(
      {
        originalUrl: '/public/missing.html',
        headers: {
          accept: 'text/html,application/xhtml+xml',
        },
      },
      res,
      next,
    );

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith(expect.stringContaining('href="/public/client.html"'));
    expect(next).not.toHaveBeenCalled();
  });
});
