import { afterEach, describe, expect, it, vi } from 'vitest';

async function loadPrepare(processMock: Record<string, unknown>) {
  vi.resetModules();
  vi.doMock('node:process', () => ({
    default: processMock,
  }));

  return import('./prepare');
}

describe('processPrepare', () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock('node:process');
    vi.restoreAllMocks();
  });

  it('sets process title and disables deprecation output on supported node versions', async () => {
    const processMock = {
      version: 'v22.13.0',
      title: 'node',
      exit: vi.fn(),
    };
    const { processPrepare } = await loadPrepare(processMock);

    processPrepare();

    expect(processMock.title).toBe('esboot');
    expect((processMock as any).noDeprecation).toBe('1');
  });

  it('exits when the node version is below the supported minimum', async () => {
    const exit = vi.fn(() => {
      throw new Error('exit');
    });
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const processMock = {
      version: 'v21.0.0',
      title: 'node',
      exit,
    };
    const { processPrepare } = await loadPrepare(processMock);

    expect(() => processPrepare()).toThrow('exit');
    expect(errorSpy).toHaveBeenCalledWith(
      'Your node version 21 is not supported, please upgrade to 22.',
    );
    expect(exit).toHaveBeenCalledWith(1);
  });
});
