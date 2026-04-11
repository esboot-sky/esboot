import { beforeEach, describe, expect, it, vi } from 'vitest';

const writeFile = vi.fn(() => Promise.resolve());

vi.mock('node:fs/promises', () => ({
  writeFile,
}));

describe('writeMultiPlatform', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('skips single-platform projects', async () => {
    const { writeMultiPlatform } = await import('./write-multi-platform');

    writeMultiPlatform({
      rootPath: '/repo/app',
      isSP: true,
    } as any);

    expect(writeFile).not.toHaveBeenCalled();
  });

  it('writes the generated multi-platform bridge file for MP projects', async () => {
    const { writeMultiPlatform } = await import('./write-multi-platform');

    writeMultiPlatform({
      rootPath: '/repo/app',
      isSP: false,
      MPConfiguration: {
        platform: 'mobile',
        pageType: 'browser',
      },
    } as any);

    await Promise.resolve();

    expect(writeFile).toHaveBeenCalledWith(
      '/repo/app/helpers/multi-platforms.ts',
      expect.stringContaining("export * from '@mobile/helpers/multi-platforms';"),
    );
    expect(writeFile).toHaveBeenCalledWith(
      '/repo/app/helpers/multi-platforms.ts',
      expect.stringContaining("export * from '@mobile-browser/helpers/multi-platforms';"),
    );
  });
});
