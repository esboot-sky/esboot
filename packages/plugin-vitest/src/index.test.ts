import process from 'node:process';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import pluginVitest, { alias } from './index';

const { exec, searchCommand } = vi.hoisted(() => ({
  exec: vi.fn(),
  searchCommand: vi.fn(() => '/resolved/vitest'),
}));

vi.mock('@dz-web/esboot-common/execa', () => ({
  exec,
}));

vi.mock('@dz-web/esboot-common/helpers', async () => {
  const actual = await vi.importActual<object>('@dz-web/esboot-common/helpers');
  return {
    ...actual,
    searchCommand,
  };
});

describe('alias', () => {
  it('should return the correct alias', () => {
    expect(alias).toEqual({
      'vitest': expect.any(String),
      '@testing-library/react': expect.any(String),
      '@testing-library/user-event': expect.any(String),
    });
  });
});

describe('is a plugin', () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  const processExit = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleError.mockClear();
    processExit.mockClear();
  });

  it('should be a function', () => {
    expect(pluginVitest).toBeInstanceOf(Function);
  });

  it('should return the correct plugin', () => {
    const plugin = pluginVitest();

    expect(plugin).toBeDefined();
    expect(plugin.name).toBe('plugin-vitest');
    expect(plugin.registerCommands).toBeDefined();
    expect(plugin.registerCommands).toBeInstanceOf(Function);

    expect(plugin.modifyConfig).toBeDefined();
    expect(plugin.modifyConfig).toBeInstanceOf(Function);

    expect(plugin.modifyTypescriptConfig).toBeDefined();
    expect(plugin.modifyTypescriptConfig).toBeInstanceOf(Function);
  });

  it('registers a vitest command that forwards passThrough arguments', async () => {
    const plugin = pluginVitest();
    const [command] = plugin.registerCommands!({ cwd: '/repo/app' } as any);

    await command.action?.('', { passThrough: '--runInBand' });

    expect(searchCommand).toHaveBeenCalled();
    expect(exec).toHaveBeenCalledWith(
      expect.stringContaining('/resolved/vitest --runInBand -r /repo/app -c '),
      expect.objectContaining({
        onError: expect.any(Function),
      }),
    );
  });

  it('stores plugin options on the plugin instance for the config loader', () => {
    const customConfig = vi.fn();
    const plugin = pluginVitest({ customConfig });

    expect((plugin as any).__esbootPluginVitestOptions).toEqual({
      customConfig,
    });
  });

  it('prints a concise error and exits with the child exit code when vitest fails', async () => {
    exec.mockImplementation(async (_command: string, { onError }: any = {}) => {
      onError?.({
        shortMessage: 'Command failed with exit code 1',
        exitCode: 1,
      });
    });

    const plugin = pluginVitest();
    const [command] = plugin.registerCommands!({ cwd: '/repo/app' } as any);

    await command.action?.('', { passThrough: 'run' });

    expect(consoleError).toHaveBeenCalledWith('Vitest run failed with exit code 1');
    expect(processExit).toHaveBeenCalledWith(1);
  });
});
