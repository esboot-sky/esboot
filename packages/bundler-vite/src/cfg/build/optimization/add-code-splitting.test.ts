import { describe, expect, it } from 'vitest';
import { addCodeSplitting } from './add-code-splitting';
import { CodeSplittingType } from '../../../types';

describe('Vite addCodeSplitting', () => {
  it('should generate manualChunks function for granularChunks', async () => {
    const viteCfg: any = {
      build: {
        rollupOptions: {}
      }
    };
    const cfg: any = {
      config: {
        bundlerOptions: {
          codeSplitting: {
            jsStrategy: CodeSplittingType.granularChunks,
            jsStrategyOptions: {
              frameworkBundles: ['react', 'react-dom'],
              customSplitting: {
                echarts: ['echarts', 'zrender'],
                paypal: /@paypal/,
                customFunc: (id: string) => id.includes('my-custom-module'),
              }
            }
          }
        }
      }
    };

    await addCodeSplitting(cfg, viteCfg);

    const manualChunks = viteCfg.build.rollupOptions.output.manualChunks;
    expect(manualChunks).toBeTypeOf('function');

    // Test customSplitting rules
    expect(manualChunks('node_modules/echarts/index.js')).toBe('echarts');
    expect(manualChunks('node_modules/zrender/index.js')).toBe('echarts');
    expect(manualChunks('node_modules/@paypal/checkout/index.js')).toBe('paypal');
    expect(manualChunks('src/my-custom-module/index.js')).toBe('customFunc');

    // Test fallback frameworkBundles
    expect(manualChunks('node_modules/react/index.js')).toBe('framework');
    expect(manualChunks('node_modules/react-dom/index.js')).toBe('framework');

    // Test unmatched modules
    expect(manualChunks('node_modules/lodash/index.js')).toBeUndefined();
  });

  it('should generate manualChunks function for bigVendors', async () => {
    const viteCfg: any = {
      build: {
        rollupOptions: {}
      }
    };
    const cfg: any = {
      config: {
        bundlerOptions: {
          codeSplitting: {
            jsStrategy: CodeSplittingType.bigVendors,
            jsStrategyOptions: {
              customSplitting: {
                echarts: ['echarts'],
              }
            }
          }
        }
      }
    };

    await addCodeSplitting(cfg, viteCfg);

    const manualChunks = viteCfg.build.rollupOptions.output.manualChunks;
    expect(manualChunks).toBeTypeOf('function');

    // Test customSplitting rules first
    expect(manualChunks('node_modules/echarts/index.js')).toBe('echarts');

    // Test fallback all other node_modules to vendors
    expect(manualChunks('node_modules/lodash/index.js')).toBe('vendors');
  });

  it('should support top-level codeSplitting merged with bundlerOptions', async () => {
    const viteCfg: any = {
      build: {
        rollupOptions: {}
      }
    };
    const cfg: any = {
      config: {
        codeSplitting: {
          jsStrategy: CodeSplittingType.granularChunks,
          jsStrategyOptions: {
            frameworkBundles: ['react'],
            customSplitting: {
              echarts: ['echarts'],
            }
          }
        },
        bundlerOptions: {
          codeSplitting: {
            jsStrategyOptions: {
              frameworkBundles: ['react', 'react-dom'],
              customSplitting: {
                zrender: ['zrender'],
              }
            }
          }
        }
      }
    };

    await addCodeSplitting(cfg, viteCfg);

    const manualChunks = viteCfg.build.rollupOptions.output.manualChunks;
    expect(manualChunks).toBeTypeOf('function');

    // customSplitting from both top-level and bundler-specific should be merged
    expect(manualChunks('node_modules/echarts/index.js')).toBe('echarts');
    expect(manualChunks('node_modules/zrender/index.js')).toBe('zrender');

    // frameworkBundles from both should be merged / overridden
    expect(manualChunks('node_modules/react/index.js')).toBe('framework');
    expect(manualChunks('node_modules/react-dom/index.js')).toBe('framework');
  });
});
