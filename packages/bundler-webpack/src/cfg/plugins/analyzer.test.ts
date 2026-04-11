import { beforeEach, describe, expect, it, vi } from 'vitest';

const BundleAnalyzerPlugin = vi.fn(function MockBundleAnalyzerPlugin(this: Record<string, unknown>, options: unknown) {
  this.options = options;
});

vi.mock('webpack-bundle-analyzer', () => ({
  BundleAnalyzerPlugin,
}));

describe('webpack bundle analyzer plugin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.ANALYZE_PORT;
  });

  it('adds bundle analyzer only for production analyze builds', async () => {
    process.env.ANALYZE_PORT = '9001';
    const { addBundleAnalyzerPlugin } = await import('./add-plugin-bundle-analyzer');
    const webpackCfg = { plugins: [] as unknown[] };

    await addBundleAnalyzerPlugin({
      config: {
        analyze: true,
        isDev: false,
      },
    } as any, webpackCfg as any);

    expect(BundleAnalyzerPlugin).toHaveBeenCalledWith(expect.objectContaining({
      analyzerPort: 9001,
      openAnalyzer: false,
      defaultSizes: 'parsed',
    }));
    expect(webpackCfg.plugins).toHaveLength(1);
  });
});
