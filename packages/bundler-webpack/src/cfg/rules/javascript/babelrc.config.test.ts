import { describe, expect, it } from 'vitest';

import { getPlugins } from './babelrc.config';

describe('getPlugins', () => {
  it('resolves aliases from the configured cwd', () => {
    const plugins = getPlugins({
      config: {
        cwd: '/repo/app',
        css: {
          modules: {
            useStyleName: false,
          },
        },
        experimental: {
          reactCompiler: {
            enable: false,
            target: '19',
          },
        },
      },
    } as any, {
      '@': 'src',
    }, false);
    const moduleResolver = plugins.find(plugin => (
      Array.isArray(plugin)
      && typeof plugin[1] === 'object'
      && plugin[1] !== null
      && 'alias' in plugin[1]
    )) as [string, { alias: Record<string, string> }] | undefined;

    expect(moduleResolver?.[1].alias).toEqual({
      '@': '/repo/app/src',
    });
  });
});
