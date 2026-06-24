import type { ConfigurationInstance } from '@dz-web/esboot';
import type { CustomViteConfiguration } from '../types';
import fs from 'node:fs/promises';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addLangJsonPicker } from './add-plugin-lang-json-picker';

vi.mock('node:fs/promises', async (importOriginal) => {
  const original = await importOriginal<typeof import('node:fs/promises')>();
  return {
    ...original,
    default: {
      ...original,
      readdir: vi.fn(),
      readFile: vi.fn(),
    },
  };
});

describe('addLangJsonPicker plugin', () => {
  let mockCfg: ConfigurationInstance;
  let mockViteCfg: CustomViteConfiguration;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCfg = {
      config: {
        useLangJsonPicker: true,
        rootPath: '/mock/root',
        isDev: false,
        entry: {
          'test-entry': {
            langJsonPicker: ['hello', 'world'],
          },
          'other-entry': {
            langJsonPicker: ['foo'],
          },
        },
      },
    } as unknown as ConfigurationInstance;

    mockViteCfg = {
      plugins: [],
    } as unknown as CustomViteConfiguration;
  });

  it('should not add plugin if useLangJsonPicker is false', async () => {
    mockCfg.config.useLangJsonPicker = false;
    await addLangJsonPicker(mockCfg, mockViteCfg);
    expect(mockViteCfg.plugins).toHaveLength(0);
  });

  it('should add plugin if useLangJsonPicker is true', async () => {
    vi.mocked(fs.readdir).mockResolvedValue(['zh-CN.json', 'en-US.json'] as any);

    await addLangJsonPicker(mockCfg, mockViteCfg);
    expect(mockViteCfg.plugins).toHaveLength(1);
    expect(mockViteCfg.plugins![0].name).toBe('vite-plugin-lang-json-picker');
  });

  it('should inject entry name script in HTML', async () => {
    vi.mocked(fs.readdir).mockResolvedValue(['zh-CN.json', 'en-US.json'] as any);

    await addLangJsonPicker(mockCfg, mockViteCfg);
    const plugin = mockViteCfg.plugins![0] as any;

    expect(plugin.transformIndexHtml).toBeDefined();
    const html = '<html><head></head><body></body></html>';
    const result = plugin.transformIndexHtml(html, { path: '/test-entry.html' });
    expect(result).toContain('<script>window.__ESBOOT_ENTRY_NAME__ = "test-entry";</script>');
  });

  it('should transform helpers/import-locales.ts with dynamic import map', async () => {
    vi.mocked(fs.readdir).mockResolvedValue(['zh-CN.json', 'en-US.json'] as any);

    await addLangJsonPicker(mockCfg, mockViteCfg);
    const plugin = mockViteCfg.plugins![0] as any;

    const originalCode = `
      switch (currentLanguage) {
        case supportedLanguage.ZH_TW:
          langData = await import('@/lang/zh-TW.json');
          break;
        default:
          langData = await import('@/lang/zh-CN.json');
          break;
      }
    `;

    const result = await plugin.transform(originalCode, '/mock/root/src/helpers/import-locales.ts');
    expect(result).toBeDefined();
    expect(result.code).toContain('const __langMap = {');
    expect(result.code).toContain('\'zh-CN-test-entry\': () => import(\'lang-zh-CN-test-entry\')');
    expect(result.code).toContain('window[\'__ESBOOT_ENTRY_NAME__\']');
  });

  it('should resolve and load virtual language JSON modules', async () => {
    vi.mocked(fs.readdir).mockResolvedValue(['zh-CN.json', 'en-US.json'] as any);
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify({
      hello: 'halo',
      world: 'sekai',
      unrelated: 'ignored',
    }));

    await addLangJsonPicker(mockCfg, mockViteCfg);
    const plugin = mockViteCfg.plugins![0] as any;

    const resolvedId = await plugin.resolveId('lang-zh-CN-test-entry');
    expect(resolvedId).toBe('lang-zh-CN-test-entry');

    const mockContext = {
      addWatchFile: vi.fn(),
    };

    const loaded = await plugin.load.call(mockContext, 'lang-zh-CN-test-entry');
    expect(loaded).toBeDefined();
    expect(loaded).toContain('halo');
    expect(loaded).toContain('sekai');
    expect(loaded).not.toContain('ignored');
    expect(mockContext.addWatchFile).toHaveBeenCalledWith('/mock/root/lang/zh-CN.json');
  });

  it('should resolve and load direct language JSON files with runtime pick logic', async () => {
    vi.mocked(fs.readdir).mockResolvedValue(['zh-CN.json', 'en-US.json'] as any);
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify({
      hello: 'halo',
      world: 'sekai',
      ignored: 'ignored',
    }));

    await addLangJsonPicker(mockCfg, mockViteCfg);
    const plugin = mockViteCfg.plugins![0] as any;

    const mockContext = {
      resolve: vi.fn().mockResolvedValue({ id: '/mock/root/lang/zh-CN.json' }),
      addWatchFile: vi.fn(),
    };

    const resolvedId = await plugin.resolveId.call(mockContext, '@/lang/zh-CN.json', '/mock/importer.ts');
    expect(resolvedId).toBe('virtual:lang-json-picker:/mock/root/lang/zh-CN.js');

    const loaded = await plugin.load.call(mockContext, resolvedId);
    expect(loaded).toBeDefined();
    expect(loaded).toContain('const rawData = {"hello":"halo","world":"sekai"};');
    expect(loaded).not.toContain('ignored');
    expect(loaded).toContain('const entryName = (typeof window !== \'undefined\' && window[\'__ESBOOT_ENTRY_NAME__\']) || \'\';');
    expect(mockContext.addWatchFile).toHaveBeenCalledWith('/mock/root/lang/zh-CN.json');
  });

  it('should handle query parameters and URL encoding in resolveId, load and transform', async () => {
    vi.mocked(fs.readdir).mockResolvedValue(['zh-CN.json'] as any);
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify({
      hello: 'halo',
      world: 'sekai',
    }));

    mockCfg.config.rootPath = '/mock/root]';
    await addLangJsonPicker(mockCfg, mockViteCfg);
    const plugin = mockViteCfg.plugins![0] as any;

    const mockContext = {
      resolve: vi.fn().mockResolvedValue({ id: '/mock/root%5D/lang/zh-CN.json?import' }),
      addWatchFile: vi.fn(),
    };

    const resolvedId = await plugin.resolveId.call(mockContext, '@/lang/zh-CN.json?import', '/mock/importer.ts');
    expect(resolvedId).toBe('virtual:lang-json-picker:/mock/root]/lang/zh-CN.js?import');

    const loaded = await plugin.load.call(mockContext, resolvedId);
    expect(loaded).toBeDefined();
    expect(mockContext.addWatchFile).toHaveBeenCalledWith('/mock/root]/lang/zh-CN.json');

    const originalCode = `
      switch (currentLanguage) {
        default:
          langData = await import('@/lang/zh-CN.json');
          break;
      }
    `;
    const transformed = await plugin.transform(originalCode, '/mock/root]/src/helpers/import-locales.ts?import');
    expect(transformed).toBeDefined();
    expect(transformed.code).toContain('const __langMap = {');
  });

  it('should watch langFolder and invalidate import-locales.ts on file add/unlink in configureServer', async () => {
    vi.mocked(fs.readdir).mockResolvedValue(['zh-CN.json'] as any);
    mockCfg.config.rootPath = '/mock/root]';
    await addLangJsonPicker(mockCfg, mockViteCfg);
    const plugin = mockViteCfg.plugins![0] as any;

    expect(plugin.configureServer).toBeDefined();

    const mockWatcher = {
      add: vi.fn(),
      on: vi.fn(),
    };
    const mockModuleMap = new Map();
    const mockMod = {
      id: '/mock/root]/src/helpers/import-locales.ts',
      url: '/src/helpers/import-locales.ts',
    };
    mockModuleMap.set('/mock/root]/src/helpers/import-locales.ts', mockMod);

    const mockServer = {
      watcher: mockWatcher,
      moduleGraph: {
        idToModuleMap: mockModuleMap,
        invalidateModule: vi.fn(),
      },
      ws: {
        send: vi.fn(),
      },
    };

    plugin.configureServer(mockServer);

    expect(mockWatcher.add).toHaveBeenCalledWith('/mock/root]/lang');
    expect(mockWatcher.on).toHaveBeenCalledWith('add', expect.any(Function));
    expect(mockWatcher.on).toHaveBeenCalledWith('unlink', expect.any(Function));
    expect(mockWatcher.on).toHaveBeenCalledWith('change', expect.any(Function));

    // Simulate adding a JSON file
    const addCallback = mockWatcher.on.mock.calls.find(call => call[0] === 'add')[1];
    addCallback('/mock/root%5D/lang/ja-JP.json');

    expect(mockServer.moduleGraph.invalidateModule).toHaveBeenCalledWith(mockMod);
    expect(mockServer.ws.send).toHaveBeenCalledWith({ type: 'full-reload' });

    // Mock virtual modules in the module map
    const mockVirtualMod1 = {
      id: 'lang-zh-CN-test',
    };
    const mockVirtualMod2 = {
      id: 'virtual:lang-json-picker:/mock/root]/lang/zh-CN.js',
    };
    const mockVirtualModOther = {
      id: 'lang-en-US-test',
    };
    const mockVirtualModOther2 = {
      id: 'virtual:lang-json-picker:/mock/root]/lang/en-US.js',
    };
    mockModuleMap.set('lang-zh-CN-test', mockVirtualMod1);
    mockModuleMap.set('virtual:lang-json-picker:/mock/root]/lang/zh-CN.js', mockVirtualMod2);
    mockModuleMap.set('lang-en-US-test', mockVirtualModOther);
    mockModuleMap.set('virtual:lang-json-picker:/mock/root]/lang/en-US.js', mockVirtualModOther2);

    // Simulate modifying a JSON file (zh-CN)
    const changeCallback = mockWatcher.on.mock.calls.find(call => call[0] === 'change')[1];
    changeCallback('/mock/root%5D/lang/zh-CN.json');

    expect(mockServer.moduleGraph.invalidateModule).toHaveBeenCalledWith(mockVirtualMod1);
    expect(mockServer.moduleGraph.invalidateModule).toHaveBeenCalledWith(mockVirtualMod2);
    expect(mockServer.moduleGraph.invalidateModule).not.toHaveBeenCalledWith(mockVirtualModOther);
    expect(mockServer.moduleGraph.invalidateModule).not.toHaveBeenCalledWith(mockVirtualModOther2);
  });
});
