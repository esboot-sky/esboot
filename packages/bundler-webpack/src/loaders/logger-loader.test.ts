import { describe, expect, it, vi } from 'vitest';

describe('logger-loader', () => {
  it('logs the module context and returns the source unchanged', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { default: loggerLoader } = await import('./logger-loader');

    const source = 'export default 1;';
    const result = loggerLoader.call({
      _module: {
        context: '/repo/app/src',
      },
    }, source);

    expect(logSpy).toHaveBeenCalledWith('logger-loader', '/repo/app/src');
    expect(result).toBe(source);

    logSpy.mockRestore();
  });
});
