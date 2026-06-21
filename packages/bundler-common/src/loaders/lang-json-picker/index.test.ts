import { describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';

vi.mock('node:fs', () => ({
  default: {
    readFileSync: vi.fn(),
  },
}));

describe('common lang-json-picker loader', () => {
  it('picks only configured nested keys based on query parameters', async () => {
    const { default: loader } = await import('./index');
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({
      home: {
        title: 'Hello',
        subtitle: 'Ignored',
      },
      common: {
        cta: 'Start',
      },
    }));

    const result = loader.call({
      getOptions: () => ({
        config: {
          rootPath: '/repo/app',
          entry: {
            home: {
              langJsonPicker: ['home.title', 'common.cta'],
            },
          },
        },
      }),
      resourceQuery: '?lang=zh-CN&entry=home',
    }, '');

    expect(result).toBe('export default {"home":{"title":"Hello"},"common":{"cta":"Start"}}');
  });

  it('returns original source if language or entry parameters are missing', async () => {
    const { default: loader } = await import('./index');
    const source = 'export default {"fallback":true}';
    const result = loader.call({
      getOptions: () => ({}),
      resourceQuery: '',
    }, source);

    expect(result).toBe(source);
  });
});
