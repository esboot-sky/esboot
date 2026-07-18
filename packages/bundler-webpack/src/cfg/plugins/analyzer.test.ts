import type { EnvProvider } from '@dz-web/esboot-common/environment';
import {
  createRecordEnvProvider,
  setShellEnvProvider,
  shellEnv,
} from '@dz-web/esboot-common/environment';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const BundleAnalyzerPlugin = vi.fn(function MockBundleAnalyzerPlugin(this: Record<string, unknown>, options: unknown) {
  this.options = options;
});

vi.mock('webpack-bundle-analyzer', () => ({
  BundleAnalyzerPlugin,
}));

describe('webpack bundle analyzer plugin', () => {
  let previousProvider: EnvProvider;

  beforeEach(() => {
    vi.clearAllMocks();
    previousProvider = setShellEnvProvider(createRecordEnvProvider({}));
  });

  afterEach(() => {
    setShellEnvProvider(previousProvider);
  });

  it('adds bundle analyzer only for production analyze builds', async () => {
    shellEnv.set('ANALYZE_PORT', '9001');
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
