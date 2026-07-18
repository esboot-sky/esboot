import { beforeEach, describe, expect, it, vi } from 'vitest';

const exec = vi.fn();
const copySync = vi.fn();
const ensureFileSync = vi.fn();
const info = vi.fn();
const resolveLibPath = vi.fn(() => '/mocked/dumi');

vi.mock('@dz-web/esboot-common/execa', () => ({
  exec,
}));

vi.mock('@dz-web/esboot-common/fs-extra', () => ({
  copySync,
  ensureFileSync,
}));

vi.mock('@dz-web/esboot-common/helpers', () => ({
  info,
  resolveLibPath,
}));

describe('plugin-docs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.APP_ROOT;
    delete process.env.DUMI_THEME;
    delete process.env.port;
  });

  it('registers a docs command that runs dumi with the generated config', async () => {
    const { default: createPlugin } = await import('./plugin');
    const plugin = createPlugin();
    const [command] = plugin.registerCommands!({ cwd: '/repo/app' } as any, {} as any);

    await command.action?.('dev', { port: '9000' });

    expect(command.name).toBe('docs');
    expect(process.env.APP_ROOT).toBe('./docs');
    expect(process.env.port).toBe('9000');
    expect(exec).toHaveBeenCalledWith(
      expect.stringContaining('node /mocked/dumi/bin/dumi.js dev --config'),
      {
        options: {
          cwd: '/repo/app',
        },
      },
    );
    expect(exec).toHaveBeenCalledWith(
      expect.stringContaining('--port 9000'),
      expect.any(Object),
    );
  });

  it('copies the docs config into the cache directory during prepare', async () => {
    const { default: createPlugin } = await import('./plugin');
    const plugin = createPlugin();

    plugin.prepare?.({ cwd: '/repo/app' } as any, {} as any);

    expect(ensureFileSync).toHaveBeenCalledWith('/repo/app/node_modules/.cache/esboot/dumi/.dumirc.ts');
    expect(copySync).toHaveBeenCalledWith(expect.stringContaining('/config/.dumirc.ts'), '/repo/app/node_modules/.cache/esboot/dumi/.dumirc.ts');
    expect(info).toHaveBeenCalledWith('Created Doc Config: /repo/app/node_modules/.cache/esboot/dumi/.dumirc.ts.');
  });
});
