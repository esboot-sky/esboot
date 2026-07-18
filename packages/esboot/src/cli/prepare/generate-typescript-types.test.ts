import { beforeEach, describe, expect, it, vi } from 'vitest';

const { writeFile, info, error } = vi.hoisted(() => ({
  writeFile: vi.fn(() => Promise.resolve()),
  info: vi.fn(),
  error: vi.fn(),
}));

vi.mock('node:fs/promises', () => ({
  writeFile,
}));

vi.mock('@dz-web/esboot-common/helpers', () => ({
  info,
  error,
}));

describe('generateTypeScriptTypes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('writes svg component and styleName declarations when enabled', async () => {
    vi.resetModules();
    vi.doMock('@/cfg', () => ({
      cfg: {
        config: {
          cwd: '/repo/app',
          svgr: true,
          css: {
            modules: {
              useStyleName: true,
            },
          },
        },
      },
    }));

    const { generateTypeScriptTypes } = await import('./generate-typescript-types');

    generateTypeScriptTypes();
    await Promise.resolve();

    expect(writeFile).toHaveBeenCalledWith(
      '/repo/app/node_modules/.cache/esboot/typescript/esboot.d.ts',
      expect.stringContaining('styleName?: string | undefined;'),
    );
    expect(writeFile).toHaveBeenCalledWith(
      '/repo/app/node_modules/.cache/esboot/typescript/esboot.d.ts',
      expect.stringContaining('const ReactComponent: React.FunctionComponent'),
    );
  });

  it('writes svg as string declarations when svgr is disabled', async () => {
    vi.resetModules();
    vi.doMock('@/cfg', () => ({
      cfg: {
        config: {
          cwd: '/repo/app',
          svgr: false,
          css: {
            modules: {
              useStyleName: false,
            },
          },
        },
      },
    }));

    const { generateTypeScriptTypes } = await import('./generate-typescript-types');

    generateTypeScriptTypes();
    await Promise.resolve();

    expect(writeFile).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('declare module \'*.svg\' {\n      const value: string;'),
    );
    expect(writeFile).not.toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('interface Attributes'),
    );
  });
});
