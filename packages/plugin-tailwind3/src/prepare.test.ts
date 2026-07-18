import process from 'node:process';

import { describe, expect, it, vi } from 'vitest';

const readFileSync = vi.fn(() => '{}');
const writeFileSync = vi.fn();
const mkdirSync = vi.fn();
const info = vi.fn();
const error = vi.fn();
const merge = vi.fn((...objects: Record<string, unknown>[]) => Object.assign({}, ...objects));

vi.mock('node:fs', () => ({
  mkdirSync,
  readFileSync,
  writeFileSync,
}));
vi.mock('@dz-web/esboot-common/helpers', () => ({
  info,
  error,
}));

vi.mock('@dz-web/esboot-common/lodash', () => ({
  merge,
}));

describe('plugin-tailwind3 prepare', () => {
  it('writes tailwind config and updates vscode configFile for Tailwind 3', async () => {
    let exitListener: (() => void) | undefined;
    const onceSpy = vi.spyOn(process, 'once').mockImplementation(((
      event: string,
      listener: () => void,
    ) => {
      if (event === 'exit') {
        exitListener = listener;
      }
      return process;
    }) as typeof process.once);

    const { default: pluginTailwind3 } = await import('./index');
    const plugin = pluginTailwind3();
    const prepare = plugin.prepare;

    expect(prepare).toBeDefined();

    prepare?.({
      cwd: '/repo/app',
    } as any);

    expect(onceSpy).toHaveBeenCalledWith('exit', expect.any(Function));
    expect(exitListener).toBeDefined();

    exitListener?.();

    expect(mkdirSync).toHaveBeenCalledWith('/repo/app/node_modules/.cache/esboot', { recursive: true });
    expect(writeFileSync).toHaveBeenCalledWith(
      '/repo/app/node_modules/.cache/esboot/tailwindcss.config.js',
      expect.stringContaining('module.exports = {'),
    );
    expect(mkdirSync).toHaveBeenCalledWith('/repo/app/.vscode', { recursive: true });
    expect(writeFileSync).toHaveBeenCalledWith(
      '/repo/app/.vscode/settings.json',
      expect.stringContaining(
        '"tailwindCSS.experimental.configFile": "node_modules/.cache/esboot/tailwindcss.config.js"',
      ),
    );

    onceSpy.mockRestore();
  });

  it('supports custom tailwindcssOptions object and callback', async () => {
    let exitListener: (() => void) | undefined;
    const onceSpy = vi.spyOn(process, 'once').mockImplementation(((
      event: string,
      listener: () => void,
    ) => {
      if (event === 'exit') {
        exitListener = listener;
      }
      return process;
    }) as typeof process.once);

    const { default: pluginTailwind3 } = await import('./index');

    // 1. Test with callback options
    const customConfigFn = vi.fn(config => ({
      ...config,
      theme: {
        extend: {
          colors: { primary: '#2E79F8' },
        },
      },
    }));
    const plugin = pluginTailwind3({
      tailwindcssOptions: customConfigFn,
    });

    plugin.prepare?.({
      cwd: '/repo/app',
    } as any);

    exitListener?.();

    expect(writeFileSync).toHaveBeenCalledWith(
      '/repo/app/node_modules/.cache/esboot/tailwindcss.config.js',
      expect.stringContaining('"primary": "#2E79F8"'),
    );
    expect(customConfigFn).toHaveBeenCalled();

    // Reset mock
    writeFileSync.mockClear();

    // 2. Test with object options
    const pluginObj = pluginTailwind3({
      tailwindcssOptions: {
        theme: {
          extend: {
            colors: { secondary: '#ff0000' },
          },
        },
      },
    });
    pluginObj.prepare?.({
      cwd: '/repo/app',
    } as any);
    exitListener?.();

    expect(writeFileSync).toHaveBeenCalledWith(
      '/repo/app/node_modules/.cache/esboot/tailwindcss.config.js',
      expect.stringContaining('"secondary": "#ff0000"'),
    );

    onceSpy.mockRestore();
  });
});
