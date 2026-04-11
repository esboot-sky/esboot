import { beforeEach, describe, expect, it, vi } from 'vitest';

const visualizer = vi.fn(() => ({ name: 'visualizer' }));

vi.mock('rollup-plugin-visualizer', () => ({
  visualizer,
}));

describe('rspack bundle analyzer plugin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds visualizer only for production analyze builds', async () => {
    const { addBundleAnalyzerPlugin } = await import('./add-plugin-bundle-analyzer');
    const rspackCfg = { plugins: [] as unknown[] };

    await addBundleAnalyzerPlugin({
      config: {
        analyze: true,
        isDev: false,
      },
    } as any, rspackCfg as any);

    expect(visualizer).toHaveBeenCalledWith({
      open: true,
      gzipSize: true,
      brotliSize: true,
    });
    expect(rspackCfg.plugins).toEqual([{ name: 'visualizer' }]);
  });
});
