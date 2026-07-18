import type { EnvProvider } from '@dz-web/esboot-common/environment';
import {
  createRecordEnvProvider,
  setShellEnvProvider,
  shellEnv,
} from '@dz-web/esboot-common/environment';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { entryLogPlugin } from './entry-log';

describe('entryLogPlugin', () => {
  const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  let previousProvider: EnvProvider;

  beforeEach(() => {
    previousProvider = setShellEnvProvider(createRecordEnvProvider({}));
  });

  afterEach(() => {
    logSpy.mockClear();
    setShellEnvProvider(previousProvider);
  });

  it('defines a plugin with correct name/key and hooks', () => {
    const plugin = entryLogPlugin();
    expect(plugin.key).toBe('entry-log');
    expect(plugin.name).toBe('entry-log');
    expect(typeof plugin.afterCompile).toBe('function');
  });

  it('logs entry details in dev mode via afterCompile with correct separators, spacing, and colored env info', () => {
    shellEnv.set('ESBOOT_PLATFORM', 'pc');
    shellEnv.set('ESBOOT_PAGE_TYPE', '_browser');

    const plugin = entryLogPlugin();
    const ctx = {
      logger: {
        info: vi.fn(),
      },
    } as any;
    const cfg = {
      isDev: true,
      cwd: '/workspace',
      entry: {
        index: {
          entry: '/workspace/src/index.entry.tsx',
          url: 'http://localhost:4000/index.html',
          tpl: 'template/index.html',
          title: 'SP Base',
        },
        admin: {
          entry: '/workspace/src/admin.entry.tsx',
          url: 'http://localhost:4000/admin.html',
          tpl: 'template/index.html',
          title: 'Admin Panel',
        },
      },
    } as any;

    plugin.afterCompile?.(cfg, ctx);

    expect(logSpy).toHaveBeenCalled();
    const printedOutput = logSpy.mock.calls[0][0];
    expect(printedOutput).toContain('Compile Entry Details');
    expect(printedOutput).toContain('Total: 2 pages');
    expect(printedOutput).toContain('Platform: pc');
    expect(printedOutput).toContain('PageType: _browser');
    expect(printedOutput).toContain('==================================================');
    expect(printedOutput).toContain('--------------------------------------------------');
    expect(printedOutput).toContain('Page 1: index');
    expect(printedOutput).toContain('Page 2: admin');
  });

  it('does not log in non-dev mode by default', () => {
    const plugin = entryLogPlugin();
    const ctx = {
      logger: {
        info: vi.fn(),
      },
    } as any;
    const cfg = {
      isDev: false,
      cwd: '/workspace',
      entry: {
        index: {
          entry: '/workspace/src/index.entry.tsx',
        },
      },
    } as any;

    plugin.afterCompile?.(cfg, ctx);

    expect(logSpy).not.toHaveBeenCalled();
  });

  it('logs in non-dev mode if devOnly is false', () => {
    const plugin = entryLogPlugin({ devOnly: false });
    const ctx = {
      logger: {
        info: vi.fn(),
      },
    } as any;
    const cfg = {
      isDev: false,
      cwd: '/workspace',
      entry: {
        index: {
          entry: '/workspace/src/index.entry.tsx',
        },
      },
    } as any;

    plugin.afterCompile?.(cfg, ctx);

    expect(logSpy).toHaveBeenCalled();
  });
});
