import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { ProgressPlugin, info, clearLine, cursorTo, write } = vi.hoisted(() => ({
  ProgressPlugin: vi.fn(function MockProgressPlugin(this: Record<string, unknown>, handler: unknown) {
    this.handler = handler;
  }),
  info: vi.fn(),
  clearLine: vi.fn(),
  cursorTo: vi.fn(),
  write: vi.fn(),
}));

vi.mock('webpack', () => ({
  ProgressPlugin,
}));

vi.mock('@dz-web/esboot-common/helpers', () => ({
  info,
}));

vi.mock('node:readline', () => ({
  default: {
    clearLine,
    cursorTo,
  },
  clearLine,
  cursorTo,
}));

describe('webpack processbar plugin', () => {
  const originalWrite = process.stdout.write;

  beforeEach(() => {
    vi.clearAllMocks();
    process.stdout.write = write as any;
  });

  it('adds progress plugin and reports used time at completion', async () => {
    const { addProcessbarPlugin } = await import('./add-plugin-processbar');
    const webpackCfg = { plugins: [] as any[] };

    await addProcessbarPlugin({ config: { isCIBuild: false } } as any, webpackCfg as any);

    expect(ProgressPlugin).toHaveBeenCalled();
    const pluginInstance = webpackCfg.plugins[0] as any;
    pluginInstance.handler(0.5, 'building');
    pluginInstance.handler(1, 'done');

    expect(write).toHaveBeenCalled();
    expect(info).toHaveBeenCalledWith(expect.stringMatching(/^Used time: \d+ms$/));
  });

  afterEach(() => {
    process.stdout.write = originalWrite;
  });
});
