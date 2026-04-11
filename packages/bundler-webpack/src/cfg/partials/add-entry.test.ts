import { beforeEach, describe, expect, it, vi } from 'vitest';

const addEntryHelper = vi.fn();
const HtmlWebpackPlugin = vi.fn(function MockHtmlWebpackPlugin(this: Record<string, unknown>, options: unknown) {
  this.options = options;
});

vi.mock('@dz-web/esboot-bundler-common', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@dz-web/esboot-bundler-common')>();
  return {
    ...actual,
    addEntry: addEntryHelper,
  };
});

vi.mock('html-webpack-plugin', () => ({
  default: HtmlWebpackPlugin,
}));

describe('webpack addEntry partial', () => {
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
    const webpackCfg = {
      entry: {},
      plugins: [] as unknown[],
    };

    await addEntry({
      config: {
        configRootPath: '/repo/app/config',
        MPConfiguration: null,
        isSP: true,
        isDev: false,
      },
    } as any, webpackCfg as any, { enableLangJsonPicker: true } as any);

    expect(webpackCfg.entry).toEqual({
      home: {
        import: '/repo/app/src/home.entry.tsx',
        layer: 'home',
      },
    });
    expect(HtmlWebpackPlugin).toHaveBeenCalledWith(expect.objectContaining({
      chunks: ['home'],
      filename: 'home.html',
      title: 'Home',
      template: '/repo/app/config/template/index.html',
    }));
  });
});
