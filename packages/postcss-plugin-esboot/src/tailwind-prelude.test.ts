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

  it('builds the Tailwind 3 prelude from @tailwind directives', () => {
    const parseCss = vi.fn((css: string, from?: string) => parse(css, { from }));
    const manager = createTailwindPreludeManager({
      parseCss,
      resolveModulePath: vi.fn(),
      readFile: vi.fn(),
      statFileMtime: vi.fn(),
    });

    const { prelude, root } = manager.getTailwindPreludeRoot('3', false, '/tmp/app.css');

    expect(prelude).toBe('@tailwind base;\n@tailwind components;\n@tailwind utilities;\n');
    expect(root.toString()).toContain('@tailwind base;');
    expect(root.toString()).toContain('@tailwind components;');
    expect(root.toString()).toContain('@tailwind utilities;');
  });

  it('builds the Tailwind 4 prelude from separate imports when requested', () => {
    const parseCss = vi.fn((css: string, from?: string) => parse(css, { from }));
    const resolveModulePath = vi.fn((specifier: string) => {
      if (specifier === 'tailwindcss/theme.css') {
        return '/fake/tailwind/theme.css';
      }

      if (specifier === 'tailwindcss/preflight.css') {
        return '/fake/tailwind/preflight.css';
      }

      if (specifier === 'tailwindcss/utilities.css') {
        return '/fake/tailwind/utilities.css';
      }

      throw new Error(`Unexpected specifier: ${specifier}`);
    });
    const readFile = vi.fn((filePath: string) => {
      if (filePath.endsWith('theme.css')) {
        return '/* theme css */';
      }

      if (filePath.endsWith('preflight.css')) {
        return '/* preflight css */';
      }

      if (filePath.endsWith('utilities.css')) {
        return '/* utilities css */';
      }

      return '';
    });
    const statFileMtime = vi.fn((filePath: string) => filePath.length);
    const manager = createTailwindPreludeManager({
      parseCss,
      resolveModulePath,
      readFile,
      statFileMtime,
    });

    const { prelude, root } = manager.getTailwindPreludeRoot('next', true, '/tmp/app.css');

    expect(resolveModulePath).toHaveBeenCalledWith('tailwindcss/theme.css');
    expect(resolveModulePath).toHaveBeenCalledWith('tailwindcss/preflight.css');
    expect(resolveModulePath).toHaveBeenCalledWith('tailwindcss/utilities.css');
    expect(prelude).toContain('/* theme css */');
    expect(prelude).toContain('/* preflight css */');
    expect(prelude).toContain('/* utilities css */');
    expect(root.toString()).toContain('/* theme css */');
    expect(root.toString()).toContain('/* preflight css */');
    expect(root.toString()).toContain('/* utilities css */');
    expect(parseCss).toHaveBeenCalledTimes(1);
  });

  it('builds the Tailwind 4 prelude from the index file when separate imports are disabled', () => {
    const parseCss = vi.fn((css: string, from?: string) => parse(css, { from }));
    const resolveModulePath = vi.fn((specifier: string) => {
      if (specifier === 'tailwindcss/index.css') {
        return '/fake/tailwind/index.css';
      }

      throw new Error(`Unexpected specifier: ${specifier}`);
    });
    const readFile = vi.fn((filePath: string) => {
      if (filePath.endsWith('index.css')) {
        return '/* tailwind index css */';
      }

      return '';
    });
    const statFileMtime = vi.fn((filePath: string) => filePath.length);
    const manager = createTailwindPreludeManager({
      parseCss,
      resolveModulePath,
      readFile,
      statFileMtime,
    });

    const { prelude, root } = manager.getTailwindPreludeRoot('next', false, '/tmp/app.css');

    expect(resolveModulePath).toHaveBeenCalledWith('tailwindcss/index.css');
    expect(prelude).toBe('/* tailwind index css */');
    expect(root.toString()).toBe('/* tailwind index css */');
    expect(parseCss).toHaveBeenCalledTimes(1);
  });
});
