import { describe, expect, it, vi } from 'vitest';

import { createSplitChunksIntent } from '../code-splitting-intent';

describe('bundler code splitting intent helpers', () => {
  it('delegates granular chunks strategy to the provided factory', () => {
    const granularChunksFactory = vi.fn().mockReturnValue({
      cacheGroups: {
        framework: {
          test: /react/,
        },
      },
    });

    expect(createSplitChunksIntent({
      jsStrategy: 'granularChunks',
      jsStrategyOptions: {
        frameworkBundles: ['react'],
      },
      granularChunksFactory,
    })).toEqual({
      cacheGroups: {
        framework: {
          test: /react/,
        },
      },
    });
    expect(granularChunksFactory).toHaveBeenCalledWith({
      frameworkBundles: ['react'],
    });
  });

  it('creates dep-per-chunk vendors naming strategy', () => {
    const splitChunks = createSplitChunksIntent({
      jsStrategy: 'depPerChunk',
      jsStrategyOptions: {},
      granularChunksFactory: vi.fn(),
    });

    expect(splitChunks).toMatchObject({
      cacheGroups: {
        vendors: {
          priority: 10,
          chunks: 'async',
        },
      },
    });
    expect(splitChunks.cacheGroups.vendors.name({
      context: '/repo/node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es',
    })).toBe('npm.lodash-es_at_4.17.21');
    expect(splitChunks.cacheGroups.vendors.name({
      context: '/repo/src/local-module',
    })).toBe('npm.unknown');
  });

  it('creates big vendors split chunks and merges custom options', () => {
    expect(createSplitChunksIntent({
      jsStrategy: 'bigVendors',
      jsStrategyOptions: {
        minSize: 30000,
      },
      granularChunksFactory: vi.fn(),
    })).toEqual({
      chunks: 'all',
      name: 'vendor',
      minChunks: 2,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
        },
      },
      minSize: 30000,
    });
  });

  it('supports customSplitting cacheGroups for granularChunks and bigVendors', () => {
    const granularChunksFactory = vi.fn().mockReturnValue({
      cacheGroups: {
        framework: {
          test: /react/,
        },
      },
    });

    const customSplitting = {
      echarts: ['echarts', 'zrender'],
      paypal: /@paypal/,
      customFunc: (id: string) => id.includes('custom'),
    };

    const splitChunks = createSplitChunksIntent({
      jsStrategy: 'granularChunks',
      jsStrategyOptions: {
        frameworkBundles: ['react'],
        customSplitting,
      },
      granularChunksFactory,
    });

    // Check custom cache groups exist
    expect(splitChunks.cacheGroups.echarts).toBeDefined();
    expect(splitChunks.cacheGroups.paypal).toBeDefined();
    expect(splitChunks.cacheGroups.customFunc).toBeDefined();

    // Verify the test function of customSplitting
    const echartsTest = splitChunks.cacheGroups.echarts.test;
    const paypalTest = splitChunks.cacheGroups.paypal.test;
    const customFuncTest = splitChunks.cacheGroups.customFunc.test;

    // Test package name array matching
    const mockEchartsModule = { nameForCondition: () => 'node_modules/echarts/index.js' };
    const mockZrenderModule = { nameForCondition: () => 'node_modules/zrender/index.js' };
    const mockLodashModule = { nameForCondition: () => 'node_modules/lodash/index.js' };
    expect(echartsTest(mockEchartsModule)).toBe(true);
    expect(echartsTest(mockZrenderModule)).toBe(true);
    expect(echartsTest(mockLodashModule)).toBe(false);

    // Test RegExp matching
    const mockPaypalModule = { nameForCondition: () => 'node_modules/@paypal/checkout/index.js' };
    expect(paypalTest(mockPaypalModule)).toBe(true);
    expect(paypalTest(mockLodashModule)).toBe(false);

    // Test custom function matching
    const mockCustomModule = { nameForCondition: () => 'src/my-custom-module/index.js' };
    expect(customFuncTest(mockCustomModule)).toBe(true);
    expect(customFuncTest(mockLodashModule)).toBe(false);
  });
});
