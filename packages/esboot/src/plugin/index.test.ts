import { PluginHooks } from '@dz-web/esboot-common/plugin';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { pluginHooksDict, preparePlugins } from './index';

afterEach(() => {
  pluginHooksDict.reset();
});

describe('preparePlugins', () => {
  it('requires every plugin to have a key', () => {
    expect(() => preparePlugins({ plugins: [{}] } as any)).toThrow('plugin.key is required');
  });

  it('resets previous listeners before preparing plugins again in the same process', () => {
    const afterCompile = vi.fn();
    const cfg = {
      plugins: [
        {
          key: 'test-plugin',
          [PluginHooks.afterCompile]: afterCompile,
        },
      ],
    } as any;

    preparePlugins(cfg);
    preparePlugins(cfg);

    expect(pluginHooksDict.getListener(PluginHooks.afterCompile)).toEqual([afterCompile]);
  });
});
