import { describe, expect, it } from 'vitest';

import {
  createRuntimeOptimizationIntent,
  shouldEnableCacheIntent,
} from '../cache-intent';

describe('bundler cache intent helpers', () => {
  it('creates deterministic runtime optimization intent', () => {
    expect(createRuntimeOptimizationIntent()).toEqual({
      runtimeChunk: 'single',
      moduleIds: 'deterministic',
    });
  });

  it('skips cache intent in development', () => {
    expect(shouldEnableCacheIntent({
      isDev: true,
      isCIBuild: false,
    })).toBe(false);
  });

  it('skips CI cache intent unless build cache is explicitly enabled', () => {
    expect(shouldEnableCacheIntent({
      isDev: false,
      isCIBuild: true,
    })).toBe(false);

    expect(shouldEnableCacheIntent({
      isDev: false,
      isCIBuild: true,
      buildCache: true,
    })).toBe(true);
  });

  it('enables cache intent for normal production builds', () => {
    expect(shouldEnableCacheIntent({
      isDev: false,
      isCIBuild: false,
    })).toBe(true);
  });
});
