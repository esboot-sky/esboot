import { parse } from 'postcss';
import { describe, expect, it, vi } from 'vitest';

import { createTailwindPreludeManager } from './tailwind-prelude';

describe('tailwind prelude manager', () => {
  it('caches the parsed Tailwind 3 prelude', () => {
    const parseCss = vi.fn((css: string, from?: string) => parse(css, { from }));
    const manager = createTailwindPreludeManager({
      parseCss,
      resolveModulePath: vi.fn(),
      readFile: vi.fn(),
      statFileMtime: vi.fn(),
    });

    const root1 = manager.getTailwindPreludeRoot('3', false, '/tmp/app.css').root;
    const root2 = manager.getTailwindPreludeRoot('3', false, '/tmp/other.css').root;

    expect(parseCss).toHaveBeenCalledTimes(1);
    expect(root1).not.toBe(root2);
    expect(root1.toString()).toBe(root2.toString());
  });
});
