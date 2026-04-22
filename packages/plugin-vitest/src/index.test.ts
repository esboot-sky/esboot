import { describe, expect, it, vi } from 'vitest';
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
    expect(exec).toHaveBeenCalledWith(expect.stringContaining('/resolved/vitest --runInBand -r /repo/app -c '));
  });
});
