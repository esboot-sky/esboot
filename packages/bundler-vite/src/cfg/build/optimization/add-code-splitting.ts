import type { AddFunc } from '@/cfg/types';
import type { BundlerViteOptions } from '@/types';
import {
  mergeFrameworkBundles,
  transformFrameworkBundles,
} from '@dz-web/esboot-bundler-common';
import { merge } from '@dz-web/esboot-common/lodash';
import { CodeSplittingType } from '../../../types';

export const addCodeSplitting: AddFunc = async (cfg, viteCfg) => {
  const { codeSplitting: topLevelCodeSplitting, bundlerOptions = {} } = cfg.config;
  const { codeSplitting: bundlerCodeSplitting } = bundlerOptions as BundlerViteOptions;
  const codeSplitting = merge({}, topLevelCodeSplitting, bundlerCodeSplitting);
  const {
    jsStrategy = CodeSplittingType.granularChunks,
    jsStrategyOptions = {},
  } = codeSplitting || {};

  let manualChunks: Record<string, any> | ((id: string) => string) = {};

  if (jsStrategy === CodeSplittingType.granularChunks) {
    const { frameworkBundles = [], customGroups } = jsStrategyOptions;
    const _frameworkBundles = transformFrameworkBundles(
      bundlerOptions as BundlerViteOptions,
      mergeFrameworkBundles(frameworkBundles),
    );

    manualChunks = (id: string) => {
      const normalizedId = id.replace(/\\/g, '/');

      if (customGroups) {
        for (const [chunkName, rule] of Object.entries(customGroups)) {
          let matchRule = rule;
          if (
            rule &&
            typeof rule === 'object' &&
            !Array.isArray(rule) &&
            !(rule instanceof RegExp)
          ) {
            matchRule = (rule as any).match;
          }

          if (Array.isArray(matchRule)) {
            for (const pkg of matchRule) {
              if (pkg instanceof RegExp) {
                if (pkg.test(normalizedId)) {
                  return chunkName;
                }
              } else if (normalizedId.includes(`node_modules/${pkg}/`)) {
                return chunkName;
              }
            }
          } else if (matchRule instanceof RegExp) {
            if (matchRule.test(normalizedId)) {
              return chunkName;
            }
          } else if (typeof matchRule === 'function') {
            if (matchRule(id)) {
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
    const { customGroups } = jsStrategyOptions;
    manualChunks = (id: string) => {
      const normalizedId = id.replace(/\\/g, '/');

      if (customGroups) {
        for (const [chunkName, rule] of Object.entries(customGroups)) {
          let matchRule = rule;
          if (
            rule &&
            typeof rule === 'object' &&
            !Array.isArray(rule) &&
            !(rule instanceof RegExp)
          ) {
            matchRule = (rule as any).match;
          }

          if (Array.isArray(matchRule)) {
            for (const pkg of matchRule) {
              if (pkg instanceof RegExp) {
                if (pkg.test(normalizedId)) {
                  return chunkName;
                }
              } else if (normalizedId.includes(`node_modules/${pkg}/`)) {
                return chunkName;
              }
            }
          } else if (matchRule instanceof RegExp) {
            if (matchRule.test(normalizedId)) {
              return chunkName;
            }
          } else if (typeof matchRule === 'function') {
            if (matchRule(id)) {
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
