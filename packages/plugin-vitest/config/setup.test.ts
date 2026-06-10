// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import './setup';

describe('plugin vitest setup', () => {
  it('polyfills window.matchMedia in jsdom', () => {
    expect(window.matchMedia).toBeTypeOf('function');

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    expect(mediaQuery.matches).toBe(false);
    expect(mediaQuery.media).toBe('(prefers-color-scheme: dark)');
    expect(mediaQuery.addListener).toBeTypeOf('function');
    expect(mediaQuery.addEventListener).toBeTypeOf('function');
  });
});
