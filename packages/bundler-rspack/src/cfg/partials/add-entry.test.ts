import { beforeEach, describe, expect, it, vi } from 'vitest';

const addEntryHelper = vi.fn();
const HtmlRspackPlugin = vi.fn(function MockHtmlRspackPlugin(this: Record<string, unknown>, options: unknown) {
  this.options = options;
});

vi.mock('@dz-web/esboot-bundler-common', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@dz-web/esboot-bundler-common')>();
  return {
    ...actual,
    addEntry: addEntryHelper,
  };
});

vi.mock('@rspack/core', () => ({
  HtmlRspackPlugin,
}));

describe('rspack addEntry partial', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    addEntryHelper.mockImplementation(async (_cfg, callback) => {
      callback({
        chunkName: 'home',
        template: 'template/index.html',
        entry: '/repo/app/src/home.entry.tsx',
        title: 'Home',
      });
    });
  });

  it('registers html plugin and layered entries when lang json picker is enabled', async () => {
    const { addEntry } = await import('./add-entry');
    const rspackCfg = {
      entry: {},
      plugins: [] as unknown[],
    };

    await addEntry({
      config: {
        configRootPath: '/repo/app/config',
        MPConfiguration: null,
        isSP: true,
        isDev: false,
        publicPath: '/',
        useLangJsonPicker: true,
      },
    } as any, rspackCfg as any);

    expect(rspackCfg.entry).toEqual({
      home: '/repo/app/src/home.entry.tsx',
    });
    expect(HtmlRspackPlugin).toHaveBeenCalledWith(expect.objectContaining({
      publicPath: '/',
      chunks: ['home'],
      filename: 'home.html',
      title: 'Home',
      template: '/repo/app/config/template/index.html',
      minify: true,
    }));
  });
});
