import { beforeEach, describe, expect, it, vi } from 'vitest';

const addDefine = vi.fn(() => ({ __TEST__: '"ok"' }));
const pathExistsSync = vi.fn();
const EnvironmentPlugin = vi.fn(function MockEnvironmentPlugin(this: Record<string, unknown>, keys: unknown) {
  this.keys = keys;
});
const DefinePlugin = vi.fn(function MockDefinePlugin(this: Record<string, unknown>, defs: unknown) {
  this.defs = defs;
});
const CopyRspackPlugin = vi.fn(function MockCopyPlugin(this: Record<string, unknown>, options: unknown) {
  this.options = options;
});

vi.mock('@dz-web/esboot-bundler-common', () => ({
  addDefine,
  injectHtml: vi.fn((html: string, _cfg: unknown, title: string) => `${html}::${title}`),
}));

vi.mock('@dz-web/esboot-common/fs-extra', () => ({
  pathExistsSync,
}));

vi.mock('@rspack/core', () => ({
  EnvironmentPlugin,
  DefinePlugin,
  CopyRspackPlugin,
  HtmlRspackPlugin: {
    getCompilationHooks: vi.fn(),
  },
}));

describe('rspack cfg plugins', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds environment and define plugins with computed definitions', async () => {
    const { addDefinePlugin } = await import('./add-plugin-define');
    const rspackCfg = { plugins: [] as unknown[] };

    await addDefinePlugin({ config: { define: {} } } as any, rspackCfg as any);

    expect(addDefine).toHaveBeenCalled();
    expect(EnvironmentPlugin).toHaveBeenCalledWith(['NODE_ENV']);
    expect(DefinePlugin).toHaveBeenCalledWith({ __TEST__: '"ok"' });
    expect(rspackCfg.plugins).toHaveLength(2);
  });

  it('adds copy plugin with only existing static paths', async () => {
    pathExistsSync.mockImplementation((from: string) => from.includes('exists'));

    const { addCopyPlugin } = await import('./add-plugin-copy');
    const rspackCfg = { plugins: [] as unknown[] };

    await addCopyPlugin({
      config: {
        staticPathList: [
          { from: '/exists/a', to: 'a' },
          { from: '/missing/b', to: 'b' },
        ],
      },
    } as any, rspackCfg as any);

    expect(CopyRspackPlugin).toHaveBeenCalledWith({
      patterns: [{ from: '/exists/a', to: 'a' }],
    });
    expect(rspackCfg.plugins).toHaveLength(1);
  });
});
