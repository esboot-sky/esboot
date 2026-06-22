import { describe, expect, it, vi, beforeEach } from 'vitest';
import { addLangJsonPicker } from './add-plugin-lang-json-picker';
import type { ConfigurationInstance } from '@dz-web/esboot';
import type { CustomViteConfiguration } from '../types';
import fs from 'node:fs/promises';

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
    expect(result.code).toContain("'zh-CN-test-entry': () => import('lang-zh-CN-test-entry')");
    expect(result.code).toContain("window['__ESBOOT_ENTRY_NAME__']");
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

    const loaded = await plugin.load('lang-zh-CN-test-entry');
    expect(loaded).toBeDefined();
    expect(loaded).toContain('halo');
    expect(loaded).toContain('sekai');
    expect(loaded).not.toContain('ignored');
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
    };

    const resolvedId = await plugin.resolveId.call(mockContext, '@/lang/zh-CN.json', '/mock/importer.ts');
    expect(resolvedId).toBe('virtual:lang-json-picker:/mock/root/lang/zh-CN.js');

    const loaded = await plugin.load(resolvedId);
    expect(loaded).toBeDefined();
    expect(loaded).toContain('const rawData = {"hello":"halo","world":"sekai"};');
    expect(loaded).not.toContain('ignored');
    expect(loaded).toContain("const entryName = (typeof window !== 'undefined' && window['__ESBOOT_ENTRY_NAME__']) || '';");
  });
});
