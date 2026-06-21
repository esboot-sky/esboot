import { beforeEach, describe, expect, it, vi } from 'vitest';

const commandActions = new Map<string, () => Promise<void> | void>();
let commandName = '';

const commandBuilder = {
  description: vi.fn().mockReturnThis(),
  allowUnknownOption: vi.fn().mockReturnThis(),
  option: vi.fn().mockReturnThis(),
  argument: vi.fn().mockReturnThis(),
  action: vi.fn((handler) => {
    commandActions.set(commandName, handler);
    return commandBuilder;
  }),
};

const program = {
  command: vi.fn((name: string) => {
    commandName = name;
    return commandBuilder;
  }),
  version: vi.fn(),
  parseAsync: vi.fn(async (argv: string[]) => {
    const selected = argv[2];
    const action = selected ? commandActions.get(selected) : undefined;

    if (action) {
      await action();
    }
  }),
};

vi.mock('commander', () => ({ program }));

const loadEnv = vi.fn();
const cfgLoad = vi.fn();
const processPrepare = vi.fn();
const preparePlugins = vi.fn();
const callPluginHookOfModifyConfig = vi.fn();
const callPluginHookOfRegisterCommands = vi.fn();
const writeMultiPlatform = vi.fn();
const logBrand = vi.fn();

vi.mock('@dz-web/esboot-common/cfg', () => ({
  loadEnv,
  ConfigLoadError: class ConfigLoadError extends Error {
    filePath: string;
    issues: Array<{ path: string; message: string }>;

    constructor(
      message: string,
      options: {
        filePath: string;
        issues: Array<{ path: string; message: string }>;
      },
    ) {
      super(message);
      this.name = 'ConfigLoadError';
      this.filePath = options.filePath;
      this.issues = options.issues;
    }
  },
}));

vi.mock('@/cfg', () => ({
  cfg: {
    load: cfgLoad,
    config: {},
  },
}));

vi.mock('@/plugin', () => ({
  pluginHooksDict: {
    state: {
      context: {},
    },
  },
  preparePlugins,
  callPluginHookOfModifyConfig,
  callPluginHookOfRegisterCommands,
}));

vi.mock('@/scripts/write-multi-platform', () => ({
  writeMultiPlatform,
}));

vi.mock('@/helpers', () => ({
  logBrand,
}));

vi.mock('./prepare', () => ({
  processPrepare,
}));

vi.mock('./prepare/index', () => ({
  prepare: vi.fn(),
}));

vi.mock('./preview', () => ({
  preview: vi.fn(),
}));

vi.mock('./mock/bridge', () => ({
  mockBridge: vi.fn(),
}));

describe('cli run', () => {
  beforeEach(() => {
    commandActions.clear();
    commandName = '';
    vi.clearAllMocks();
    process.argv = ['node', 'esboot', 'dev'];
    process.exitCode = undefined;
  });

  it('prints a single friendly message when config loading fails', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { ConfigLoadError } = await import('@dz-web/esboot-common/cfg');
    cfgLoad.mockRejectedValueOnce(new ConfigLoadError(
      'esboot config load error',
      {
        filePath: '/repo/.esbootrc.ts',
        issues: [
          {
            path: 'server.port',
            message: 'Invalid input: expected number, received string',
          },
        ],
      },
    ));

    const { run } = await import('./index');

    await expect(run()).resolves.toBeUndefined();
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('esboot config load error'),
    );
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('server.port'),
    );
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('/repo/.esbootrc.ts'),
    );
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(process.exitCode).toBe(1);
  });
});
