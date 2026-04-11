import { describe, expect, it } from 'vitest';

import { extractPlatformAndType } from './extract-platform-and-type.js';

describe('extractPlatformAndType', () => {
  it('extracts platform and pageType from platform-scoped paths', () => {
    expect(extractPlatformAndType('/repo/src/platforms/mobile/_browser/pages/home.ts')).toEqual({
      platform: 'mobile',
      pageType: 'browser',
    });
    expect(extractPlatformAndType('/repo/src/platforms/pc/_native/pages/home.ts')).toEqual({
      platform: 'pc',
      pageType: 'native',
    });
  });

  it('extracts platform with undefined pageType when only platform is present', () => {
    expect(extractPlatformAndType('/repo/src/platforms/mobile/pages/home.ts')).toEqual({
      platform: 'mobile',
      pageType: undefined,
    });
  });

  it('returns null for non-platform paths', () => {
    expect(extractPlatformAndType('/repo/src/views/home.ts')).toBeNull();
  });
});
