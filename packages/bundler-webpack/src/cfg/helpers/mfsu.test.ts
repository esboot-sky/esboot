import { beforeEach, describe, expect, it, vi } from 'vitest';

const setWebpackConfig = vi.fn();
const MFSUMock = vi.fn(function MockMFSU(this: Record<string, unknown>, options: unknown) {
  this.options = options;
  this.setWebpackConfig = setWebpackConfig;
});

vi.mock('@umijs/mfsu', () => ({
  MFSU: MFSUMock,
}));

vi.mock('webpack', () => ({
  default: {
    mocked: true,
  },
}));

describe('mfsu helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates an mfsu instance in dev mode when enabled', async () => {
    const { createMFSU } = await import('./mfsu');

    const mfsu = createMFSU({
      config: {
        cwd: '/repo/app',
        isDev: true,
        bundlerOptions: {
          mfsu: true,
          mfsuOptions: (defaults: Record<string, unknown>) => ({
            ...defaults,
            customFlag: true,
          }),
        },
      },
    } as any);

    expect(mfsu).toBeTruthy();
    expect(MFSUMock).toHaveBeenCalledWith(expect.objectContaining({
      cwd: '/repo/app',
      strategy: 'normal',
      customFlag: true,
    }));
  });

  it('returns null when mfsu is disabled or not in dev mode', async () => {
    const { createMFSU } = await import('./mfsu');

    expect(createMFSU({
      config: {
        cwd: '/repo/app',
        isDev: false,
        bundlerOptions: {
          mfsu: true,
        },
      },
    } as any)).toBeNull();

    expect(createMFSU({
      config: {
        cwd: '/repo/app',
        isDev: true,
        bundlerOptions: {
          mfsu: false,
        },
      },
    } as any)).toBeNull();
  });

  it('normalizes lang-json-picker entries before delegating to mfsu', async () => {
    const { wrapCfgWithMfsu } = await import('./mfsu');

    const webpackCfg = {
      entry: {
        home: {
          import: '/repo/app/src/home.entry.tsx',
        },
      },
    };

    const mfsu = {
      setWebpackConfig,
    };

    const result = await wrapCfgWithMfsu({
      config: {
        isDev: true,
        useLangJsonPicker: true,
      },
    } as any, webpackCfg as any, { mfsu } as any);

    expect(webpackCfg.entry.home).toBe('/repo/app/src/home.entry.tsx');
    expect(setWebpackConfig).toHaveBeenCalledWith({
      config: webpackCfg,
      depConfig: {},
    });
    expect(result).toBe(webpackCfg);
  });

  it('does not throw when bundlerOptions is missing', async () => {
    const { createMFSU } = await import('./mfsu');

    expect(
      createMFSU({
        config: {
          cwd: '/repo/app',
          isDev: false,
        },
      } as any),
    ).toBeNull();

    const mfsu = createMFSU({
      config: {
        cwd: '/repo/app',
        isDev: true,
      },
    } as any);
    expect(mfsu).toBeTruthy();
  });
});
