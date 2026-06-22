import { describe, expect, it, vi } from 'vitest';
import { addPostcssPluginPx2rem, normalizeExclude } from './add-plugin-px2rem';

const px2remPlugin = vi.fn(() => 'postcss-px2rem');

vi.mock('@alitajs/postcss-plugin-px2rem', () => ({
  default: px2remPlugin,
}));

describe('normalizeExclude', () => {
  it('handles empty / undefined / false values', () => {
    expect(normalizeExclude()).toBeUndefined();
    expect(normalizeExclude(false)).toBe(false);
    expect(normalizeExclude([])).toBeUndefined();
  });

  it('handles single string or RegExp', () => {
    expect(normalizeExclude('node_modules')).toBe('node_modules');
    const regex = /node_modules/;
    expect(normalizeExclude(regex)).toBe(regex);
  });

  it('handles arrays of strings and RegExps', () => {
    const normalized = normalizeExclude(['node_modules', /src\/components/]);
    expect(normalized).toBeInstanceOf(RegExp);
    expect((normalized as RegExp).source).toBe('node_modules|src\\/components');
  });
});

describe('addPostcssPluginPx2rem', () => {
  it('returns false when disabled', async () => {
    const result = await addPostcssPluginPx2rem({
      config: {
        px2rem: { enable: false },
        isMobile: false,
      },
    } as any);

    expect(result).toBe(false);
  });

  it('passes normalized exclude to px2rem plugin', async () => {
    await addPostcssPluginPx2rem({
      config: {
        px2rem: {
          enable: true,
          exclude: ['node_modules', /src\/components/],
        },
        isMobile: true,
      },
    } as any);

    expect(px2remPlugin).toHaveBeenCalledWith(
      expect.objectContaining({
        exclude: expect.any(RegExp),
      })
    );
  });
});
