import { beforeEach, describe, expect, it, vi } from 'vitest';

const CssMinimizerPlugin = vi.fn(function MockCssMinimizerPlugin(this: Record<string, unknown>, options: unknown) {
  this.options = options;
});
const TerserPlugin = vi.fn(function MockTerserPlugin(this: Record<string, unknown>, options: unknown) {
  this.options = options;
});
(TerserPlugin as any).terserMinify = vi.fn();

const addCodeSplitting = vi.fn();

vi.mock('css-minimizer-webpack-plugin', () => ({
  default: CssMinimizerPlugin,
}));

vi.mock('terser-webpack-plugin', () => ({
  default: TerserPlugin,
}));

vi.mock('./code-splitting/add-code-splitting', () => ({
  addCodeSplitting,
}));

describe('webpack optimization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('skips optimization entirely in development', async () => {
    const { addOptimization } = await import('./add-optimization');
    const webpackCfg: Record<string, any> = {};

    await addOptimization({ config: { isDev: true, minimize: true } } as any, webpackCfg);

    expect(webpackCfg.optimization).toBeUndefined();
  });

  it('configures minimizers and code splitting for production builds', async () => {
    const { addOptimization } = await import('./add-optimization');
    const webpackCfg: Record<string, any> = {};

    await addOptimization({
      config: {
        isDev: false,
        minimize: true,
        jsMinifierOptions: { compress: { drop_console: true } },
        cssMinifierOptions: { preset: 'default' },
      },
    } as any, webpackCfg);

    expect(webpackCfg.optimization.minimize).toBe(true);
    expect(TerserPlugin).toHaveBeenCalled();
    expect(CssMinimizerPlugin).toHaveBeenCalledWith({ preset: 'default' });
    expect(addCodeSplitting).toHaveBeenCalled();
  });
});
