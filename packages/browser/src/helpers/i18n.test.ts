import { describe, expect, it } from 'vitest';

import { flattenLangObject } from './i18n';

describe('flattenLangObject', () => {
  it('flattens nested translation objects with dot-separated keys', () => {
    expect(flattenLangObject({
      home: {
        title: 'Hello',
        banner: {
          cta: 'Start',
        },
      },
      count: 3,
    })).toEqual({
      'home.banner.cta': 'Start',
      'home.title': 'Hello',
      count: 3,
    });
  });

  it('keeps arrays, null values, and primitive leaves intact', () => {
    expect(flattenLangObject({
      list: ['a', 'b'],
      empty: null,
      enabled: false,
    })).toEqual({
      list: ['a', 'b'],
      empty: null,
      enabled: false,
    });
  });
});
