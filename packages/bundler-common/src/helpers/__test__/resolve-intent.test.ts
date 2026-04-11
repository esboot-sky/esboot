import { describe, expect, it } from 'vitest';

import { createResolveIntent } from '../resolve-intent';

describe('bundler resolve intent helpers', () => {
  it('creates resolved aliases and shared extensions', () => {
    const resolveIntent = createResolveIntent({
      alias: {
        '@': 'src',
        '@shared': 'shared',
      },
    });

    expect(resolveIntent.alias['@']).toContain('/src/');
    expect(resolveIntent.alias['@shared']).toContain('/shared/');
    expect(resolveIntent.extensions).toEqual([
      '.wasm',
      '.mjs',
      '.cjs',
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.json',
    ]);
  });

  it('adds mainFields only when requested', () => {
    expect(createResolveIntent({
      alias: {},
      includeMainFields: true,
    }).mainFields).toEqual(['module', 'browser', 'main']);

    expect(createResolveIntent({
      alias: {},
    }).mainFields).toBeUndefined();
  });
});
