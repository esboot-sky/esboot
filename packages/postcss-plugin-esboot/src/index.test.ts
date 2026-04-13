import postcss, { parse } from 'postcss';
import { describe, expect, it } from 'vitest';

import createPlugin from './index';

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
});
