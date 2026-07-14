import type { AddFunc } from '@/cfg/types';
import type { BundlerViteOptions } from '@/types';
import {
  mergeFrameworkBundles,
  transformFrameworkBundles,
} from '@dz-web/esboot-bundler-common';
import { CodeSplittingType } from '../../../types';

export const addCodeSplitting: AddFunc = async (cfg, viteCfg) => {
  const { bundlerOptions = {} } = cfg.config;
  const { codeSplitting } = bundlerOptions as BundlerViteOptions;
  const {
    jsStrategy = CodeSplittingType.granularChunks,
    jsStrategyOptions = {},
  } = codeSplitting || {};

  let manualChunks: Record<string, any> | ((id: string) => string) = {};

  if (jsStrategy === CodeSplittingType.granularChunks) {
    const { frameworkBundles = [], customSplitting } = jsStrategyOptions;
    const _frameworkBundles = transformFrameworkBundles(
      bundlerOptions as BundlerViteOptions,
      mergeFrameworkBundles(frameworkBundles),
    );

    manualChunks = (id: string) => {
      const normalizedId = id.replace(/\\/g, '/');

      if (customSplitting) {
        for (const [chunkName, rule] of Object.entries(customSplitting)) {
          if (Array.isArray(rule)) {
            for (const pkg of rule) {
              if (normalizedId.includes(`node_modules/${pkg}/`)) {
                return chunkName;
              }
            }
          } else if (rule instanceof RegExp) {
            if (rule.test(normalizedId)) {
              return chunkName;
            }
          } else if (typeof rule === 'function') {
            if (rule(id)) {
              return chunkName;
            }
          }
        }
      }

      if (id.includes('node_modules')) {
        for (const dep of _frameworkBundles) {
          if (normalizedId.includes(`node_modules/${dep}/`)) {
            return 'framework';
          }
        }
      }
    };
  }
  else if (jsStrategy === CodeSplittingType.bigVendors) {
    const { customSplitting } = jsStrategyOptions;
    manualChunks = (id: string) => {
      const normalizedId = id.replace(/\\/g, '/');

      if (customSplitting) {
        for (const [chunkName, rule] of Object.entries(customSplitting)) {
          if (Array.isArray(rule)) {
            for (const pkg of rule) {
              if (normalizedId.includes(`node_modules/${pkg}/`)) {
                return chunkName;
              }
            }
          } else if (rule instanceof RegExp) {
            if (rule.test(normalizedId)) {
              return chunkName;
            }
          } else if (typeof rule === 'function') {
            if (rule(id)) {
              return chunkName;
            }
          }
        }
      }

      if (id.includes('node_modules')) {
        return 'vendors';
      }
    };
  }

  Object.assign(viteCfg.build!.rollupOptions!, {
    output: {
      manualChunks,
    },
  });
};
