import { describe, expect, it } from 'vitest';
import { addCodeSplitting } from './add-code-splitting';
import { CodeSplittingType } from '../../../types';

describe('Webpack addCodeSplitting', () => {
  it('should assign splitChunks configuration correctly', async () => {
    const webpackCfg: any = {
      optimization: {},
    };
    const cfg: any = {
      config: {
        bundlerOptions: {
          codeSplitting: {
            jsStrategy: CodeSplittingType.granularChunks,
            jsStrategyOptions: {
              frameworkBundles: ['react'],
              customSplitting: {
                echarts: ['echarts'],
              },
            },
          },
        },
      },
    };

    await addCodeSplitting(cfg, webpackCfg);

    const splitChunks = webpackCfg.optimization.splitChunks;
    expect(splitChunks).toBeDefined();
    expect(splitChunks.cacheGroups).toBeDefined();
    expect(splitChunks.cacheGroups.echarts).toBeDefined();

    // Verify Custom Cache Group test method behaves correctly
    const echartsTest = splitChunks.cacheGroups.echarts.test;
    const mockEchartsModule = { nameForCondition: () => 'node_modules/echarts/index.js' };
    const mockLodashModule = { nameForCondition: () => 'node_modules/lodash/index.js' };
    expect(echartsTest(mockEchartsModule)).toBe(true);
    expect(echartsTest(mockLodashModule)).toBe(false);
  });

  it('should support top-level codeSplitting merged with bundlerOptions', async () => {
    const webpackCfg: any = {
      optimization: {},
    };
    const cfg: any = {
      config: {
        codeSplitting: {
          jsStrategy: CodeSplittingType.granularChunks,
          jsStrategyOptions: {
            frameworkBundles: ['react'],
            customSplitting: {
              echarts: ['echarts'],
            },
          },
        },
        bundlerOptions: {
          codeSplitting: {
            jsStrategyOptions: {
              frameworkBundles: ['react', 'react-dom'],
              customSplitting: {
                zrender: ['zrender'],
              },
            },
          },
        },
      },
    };

    await addCodeSplitting(cfg, webpackCfg);

    const splitChunks = webpackCfg.optimization.splitChunks;
    expect(splitChunks).toBeDefined();
    expect(splitChunks.cacheGroups).toBeDefined();
    expect(splitChunks.cacheGroups.echarts).toBeDefined();
    expect(splitChunks.cacheGroups.zrender).toBeDefined();

    // Verify Custom Cache Group test method behaves correctly
    const echartsTest = splitChunks.cacheGroups.echarts.test;
    const zrenderTest = splitChunks.cacheGroups.zrender.test;
    const mockEchartsModule = { nameForCondition: () => 'node_modules/echarts/index.js' };
    const mockZrenderModule = { nameForCondition: () => 'node_modules/zrender/index.js' };
    const mockLodashModule = { nameForCondition: () => 'node_modules/lodash/index.js' };
    expect(echartsTest(mockEchartsModule)).toBe(true);
    expect(zrenderTest(mockZrenderModule)).toBe(true);
    expect(echartsTest(mockLodashModule)).toBe(false);
  });
});
