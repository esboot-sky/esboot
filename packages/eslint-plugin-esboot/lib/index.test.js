import { beforeEach, describe, expect, it, vi } from 'vitest';

const resolveAlias = vi.fn(({ targetPath }) => targetPath);
const extractPlatformAndType = vi.fn();

vi.mock('@dz-web/esboot-common/helpers', () => ({
  resolveAlias,
}));

vi.mock('./helpers/extract-platform-and-type.js', () => ({
  extractPlatformAndType,
}));

describe('eslint-plugin-esboot', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exposes recommended configs and both rules', async () => {
    const { default: plugin } = await import('./index.js');

    expect(plugin.meta.namespace).toBe('esboot');
    expect(plugin.rules).toHaveProperty('no-cross-platform-imports');
    expect(plugin.rules).toHaveProperty('no-cross-platform-lib-imports');
    expect(plugin.configs.recommended.rules).toEqual({
      '@dz-web/esboot/no-cross-platform-imports': 'error',
    });
  });

  it('reports cross-platform imports from platform files', async () => {
    extractPlatformAndType
      .mockReturnValueOnce({ platform: 'mobile', pageType: 'browser' })
      .mockReturnValueOnce({ platform: 'pc', pageType: 'browser' });

    const { default: rule } = await import('./rules/no-cross-platform-imports.js');
    const report = vi.fn();
    const visitors = rule.create({
      filename: '/repo/src/platforms/mobile/pages/home.ts',
      report,
    });

    visitors.ImportDeclaration({
      source: {
        value: '@/platforms/pc/pages/home',
      },
    });

    expect(report).toHaveBeenCalledWith(expect.objectContaining({
      messageId: 'noImportOtherPlatforms',
      data: {
        desc: 'You cannot import files from the pc platform here.',
      },
    }));
  });

  it('reports blocked platform-specific libs for the current platform', async () => {
    extractPlatformAndType.mockReturnValue({ platform: 'mobile', pageType: 'browser' });

    const { default: rule } = await import('./rules/no-cross-platform-lib-imports.js');
    const report = vi.fn();
    const visitors = rule.create({
      filename: '/repo/src/platforms/mobile/pages/home.ts',
      options: [['antd'], ['element-plus']],
      report,
    });

    visitors.ImportDeclaration({
      source: {
        value: 'antd/es/button',
      },
    });

    expect(report).toHaveBeenCalledWith(expect.objectContaining({
      messageId: 'noImportThisLibsWithinTheCurrentPlatform',
      data: {
        lib: 'antd',
      },
    }));
  });
});
