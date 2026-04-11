import { describe, expect, it, vi } from 'vitest';

import { absListPath, absPath, logBrand } from './index';

describe('esboot helpers', () => {
  it('resolves relative paths against cwd and preserves absolute paths', () => {
    const cfg = { cwd: '/repo/app' } as any;

    expect(absPath(cfg, 'src/index.ts')).toBe('/repo/app/src/index.ts');
    expect(absPath(cfg, '/tmp/absolute.ts')).toBe('/tmp/absolute.ts');
    expect(absListPath(cfg, ['src/index.ts', '/tmp/absolute.ts'])).toEqual([
      '/repo/app/src/index.ts',
      '/tmp/absolute.ts',
    ]);
  });

  it('prints the branded version banner', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    logBrand({ version: '4.1.4' } as any);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('ESBoot v4.1.4'));
    logSpy.mockRestore();
  });
});
