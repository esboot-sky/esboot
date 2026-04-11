import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  build,
  createViteServer,
  expressApp,
  expressFactory,
  getCfg,
  loadHtmlContent,
  renderSsgHtmlForPage,
  prerenderSsgPages,
  onAfterCompile,
  close,
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
  renderSsgHtmlForPage: vi.fn(),
  prerenderSsgPages: vi.fn(),
  onAfterCompile: vi.fn(),
  close: vi.fn(),
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
          docs: {
            entry: '/src/docs.entry.tsx',
            sourceEntry: '/repo/app/src/docs.entry.tsx',
            template: '/repo/app/config/template/index.html',
            title: 'Docs',
          },
        },
      },
    });
    loadHtmlContent.mockResolvedValue('<html><body><div id="root"></div></body></html>');
    renderSsgHtmlForPage.mockImplementation(async ({ html }) => html);
  });

  it('builds and then prerenders ssg pages', async () => {
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
    expect(createViteServer).toHaveBeenCalled();
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
});
