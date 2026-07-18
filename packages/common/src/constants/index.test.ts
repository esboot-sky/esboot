import { describe, expect, it } from 'vitest';

import * as constants from './index';

const { getCacheDir, getWebpackCacheDir } = constants;

describe('cache path helpers', () => {
  it('resolves cache paths from an explicit project cwd', () => {
    expect(getCacheDir('/repo/app')).toBe('/repo/app/node_modules/.cache/esboot');
    expect(getWebpackCacheDir('/repo/app')).toBe('/repo/app/node_modules/.cache/esboot/webpack-cache');
  });

  it('does not expose process-relative cache paths', () => {
    expect(constants).not.toHaveProperty('cacheDir');
    expect(constants).not.toHaveProperty('webpackCacheDir');
  });
});
