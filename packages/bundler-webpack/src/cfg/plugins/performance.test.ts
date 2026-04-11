import { beforeEach, describe, expect, it, vi } from 'vitest';

const info = vi.fn();

vi.mock('@dz-web/esboot-common/helpers', () => ({
  info,
}));

describe('webpack performance plugin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('reports initial compile and rebuild timings in development', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-11T11:00:00.000Z'));

    const { addPerformancePlugin } = await import('./add-plugin-performance');
    const webpackCfg = { plugins: [] as unknown[] };

    await addPerformancePlugin({
      config: {
        isDev: true,
        isCIBuild: false,
      },
    } as any, webpackCfg as any);

    const plugin = webpackCfg.plugins[0] as { apply: (compiler: any) => void };
    let invalidHook!: () => void;
    let doneHook!: () => void;

    plugin.apply({
      hooks: {
        invalid: {
          tap: (_name: string, callback: () => void) => {
            invalidHook = callback;
          },
        },
        done: {
          tap: (_name: string, callback: () => void) => {
            doneHook = callback;
          },
        },
      },
    });

    vi.advanceTimersByTime(1200);
    doneHook();

    invalidHook();
    vi.advanceTimersByTime(180);
    doneHook();

    expect(info).toHaveBeenNthCalledWith(1, 'Initial compile time: 1200ms');
    expect(info).toHaveBeenNthCalledWith(2, 'Rebuild time: 180ms');

    vi.useRealTimers();
  });
});
