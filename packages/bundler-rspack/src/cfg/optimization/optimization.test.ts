import { beforeEach, describe, expect, it, vi } from 'vitest';

const SwcJsMinimizerRspackPlugin = vi.fn(function MockSwcJsMinimizerRspackPlugin(this: Record<string, unknown>, options: unknown) {
  this.options = options;
});
const LightningCssMinimizerRspackPlugin = vi.fn(function MockLightningCssMinimizerRspackPlugin(this: Record<string, unknown>, options: unknown) {
  this.options = options;
});
const addCodeSplitting = vi.fn();

vi.mock('@rspack/core', () => ({
  SwcJsMinimizerRspackPlugin,
  LightningCssMinimizerRspackPlugin,
}));

vi.mock('./code-splitting/add-code-splitting', () => ({
  addCodeSplitting,
}));

describe('rspack optimization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('skips optimization entirely in development', async () => {
    const { addOptimization } = await import('./add-optimization');
    const rspackCfg: Record<string, any> = {};

    await addOptimization({ config: { isDev: true, minimize: true } } as any, rspackCfg);

    expect(rspackCfg.optimization).toBeUndefined();
  });

  it('configures rspack minimizers and code splitting for production builds', async () => {
    const { addOptimization } = await import('./add-optimization');
    const rspackCfg: Record<string, any> = {};

    await addOptimization({
      config: {
        isDev: false,
        minimize: true,
      },
    } as any, rspackCfg);

    expect(rspackCfg.optimization.minimize).toBe(true);
    expect(SwcJsMinimizerRspackPlugin).toHaveBeenCalled();
    expect(LightningCssMinimizerRspackPlugin).toHaveBeenCalledWith({
      minimizerOptions: {
        errorRecovery: false,
      },
    });
    expect(addCodeSplitting).toHaveBeenCalled();
  });

  it('respects custom jsMinifierOptions', async () => {
    const { addOptimization } = await import('./add-optimization');
    const rspackCfg: Record<string, any> = {};

    await addOptimization({
      config: {
        isDev: false,
        minimize: true,
        jsMinifierOptions: {
          compress: {
            drop_console: false,
            pure_funcs: [],
          },
        },
      },
    } as any, rspackCfg);

    expect(SwcJsMinimizerRspackPlugin).toHaveBeenCalledWith({
      minimizerOptions: expect.objectContaining({
        compress: {
          drop_console: false,
          drop_debugger: true,
          pure_funcs: [],
        },
      }),
    });
  });
});
