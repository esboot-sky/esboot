import { describe, expect, it, vi } from 'vitest';

const createJitiSpy = vi.fn((_id, _options) => {
  return {
    import: vi.fn(),
  };
});

vi.mock('jiti', () => {
  return {
    createJiti: createJitiSpy,
  };
});

describe('jiti options', () => {
  it('should create jiti with rolldown and esbuild in nativeModules', async () => {
    await import('../cfg');

    expect(createJitiSpy).toHaveBeenCalled();
    const [, options] = createJitiSpy.mock.calls[0];
    expect(options).toEqual(
      expect.objectContaining({
        nativeModules: expect.arrayContaining(['rolldown', 'esbuild']),
      }),
    );
  });
});
