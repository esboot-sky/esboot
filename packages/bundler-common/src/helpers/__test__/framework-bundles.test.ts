import { describe, expect, it } from 'vitest';
import { mergeFrameworkBundles } from '../framework-bundles';

describe('mergeFrameworkBundles', () => {
  it('keeps React packages first and appends custom framework bundles', () => {
    expect(mergeFrameworkBundles(['dayjs', 'zustand'])).toEqual([
      'react-dom',
      'react',
      'dayjs',
      'zustand',
    ]);
  });
});
