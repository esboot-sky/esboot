import postcss, { parse } from 'postcss';
import { describe, expect, it, vi } from 'vitest';

import createPlugin from './index';

const { getTailwindPreludeRoot } = vi.hoisted(() => ({
  getTailwindPreludeRoot: vi.fn(),
}));

vi.mock('./tailwind-prelude', async () => {
  const { parse: parseCss } = await import('postcss');

  getTailwindPreludeRoot.mockImplementation((tailwindVersion: '3' | 'next', useSeparateTailwindImports: boolean) => {
    if (tailwindVersion === '3') {
      const prelude = '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n';
      return {
        prelude,
        root: parseCss(prelude),
      };
    }

    if (useSeparateTailwindImports) {
      const prelude = '/* tailwind v4 separate */\n@layer theme {}\n@layer base {}\n@layer utilities {}';
      return {
        prelude,
        root: parseCss(prelude),
      };
    }

    const prelude = '/* tailwind v4 combined */\n@import "tailwindcss";';
    return {
      prelude,
      root: parseCss(prelude),
    };
  });

  return {
    getTailwindPreludeRoot,
  };
});

describe('postcss-plugin-esboot', () => {
  it('leaves css untouched when tailwind support is disabled', async () => {
    const plugin = await createPlugin({ useTailwindcss: false, useSeparateTailwindImports: true, isDev: true });
    const input = 'body { color: red; }';
    const root = parse(input, { from: '/tmp/app.css' });

    plugin.Once(root, {
      result: {
        opts: {
          from: '/tmp/app.css',
        },
      },
    });

    expect(root.toString()).toBe(input);
  });

  it('leaves non-entry css untouched when no tailwind marker is present', async () => {
    const plugin = await createPlugin({ useTailwindcss: true, useSeparateTailwindImports: true, isDev: true });
    const result = await postcss([plugin]).process('.btn { color: red; }', {
      from: '/tmp/app.css',
    });

    expect(result.css).toContain('.btn { color: red; }');
    expect(result.css).not.toContain('ESBOOT_SIGN_TAILWIND_CSS');
  });

  it('injects tailwind directives for version 3 entries', async () => {
    const plugin = await createPlugin({
      useTailwindcss: true,
      useSeparateTailwindImports: true,
      isDev: true,
      tailwindVersion: '3',
    });

    const result = await postcss([plugin]).process('/* ESBOOT_SIGN_TAILWIND_CSS */\n.btn { color: red; }', {
      from: '/tmp/app.css',
    });

    expect(result.css).toContain('@tailwind base;');
    expect(result.css).toContain('@tailwind components;');
    expect(result.css).toContain('@tailwind utilities;');
    expect(result.css).toContain('.btn { color: red; }');
    expect(result.css).not.toContain('ESBOOT_SIGN_TAILWIND_CSS');
    expect(result.css).not.toContain('tailwindcss/theme.css');
  });

  it('injects tailwind directives when the entry marker appears after @charset', async () => {
    const plugin = await createPlugin({
      useTailwindcss: true,
      useSeparateTailwindImports: true,
      isDev: true,
      tailwindVersion: '3',
    });

    const result = await postcss([plugin]).process('@charset "UTF-8";\nESBOOT_SIGN_TAILWIND_CSS\n.btn { color: red; }', {
      from: '/tmp/app.css',
    });

    expect(result.css).toContain('@tailwind base;');
    expect(result.css).toContain('@tailwind components;');
    expect(result.css).toContain('@tailwind utilities;');
    expect(result.css).toContain('.btn { color: red; }');
    expect(result.css).not.toContain('ESBOOT_SIGN_TAILWIND_CSS');
  });

  it('keeps Tailwind 4 prelude content intact for separate imports', async () => {
    const plugin = await createPlugin({
      useTailwindcss: true,
      useSeparateTailwindImports: true,
      isDev: true,
      tailwindVersion: 'next',
    });

    const result = await postcss([plugin]).process('/* ESBOOT_SIGN_TAILWIND_CSS */\n.btn { color: red; }', {
      from: '/tmp/app.css',
    });

    expect(getTailwindPreludeRoot).toHaveBeenCalledWith('next', true, '/tmp/app.css');
    expect(result.css).toContain('/* tailwind v4 separate */');
    expect(result.css).toContain('@layer theme');
    expect(result.css).toContain('@layer base');
    expect(result.css).toContain('@layer utilities');
    expect(result.css).toContain('.btn { color: red; }');
    expect(result.css).not.toContain('ESBOOT_SIGN_TAILWIND_CSS');
  });

  it('keeps Tailwind 4 prelude content intact for combined imports', async () => {
    const plugin = await createPlugin({
      useTailwindcss: true,
      useSeparateTailwindImports: false,
      isDev: true,
      tailwindVersion: 'next',
    });

    const result = await postcss([plugin]).process('/* ESBOOT_SIGN_TAILWIND_CSS */\n.btn { color: red; }', {
      from: '/tmp/app.css',
    });

    expect(getTailwindPreludeRoot).toHaveBeenCalledWith('next', false, '/tmp/app.css');
    expect(result.css).toContain('/* tailwind v4 combined */');
    expect(result.css).toContain('@import "tailwindcss"');
    expect(result.css).toContain('.btn { color: red; }');
    expect(result.css).not.toContain('ESBOOT_SIGN_TAILWIND_CSS');
  });
});
