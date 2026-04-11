import { describe, expect, it } from 'vitest';

describe('rspack lang-json-picker loader', () => {
  it('picks only configured nested keys for matching lang directory modules', async () => {
    const { default: loader } = await import('./index');

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
      _module: {
        context: '/repo/app/lang',
        layer: 'home',
      },
    }, JSON.stringify({
      home: {
        title: 'Hello',
        subtitle: 'Ignored',
      },
      common: {
        cta: 'Start',
      },
    }));

    expect(result).toBe('export default {"home":{"title":"Hello"},"common":{"cta":"Start"}}');
  });
});
