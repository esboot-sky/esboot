import { PluginHooks } from '@dz-web/esboot-common/plugin';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { definePlugin, pluginHooksDict, preparePlugins } from './index';

afterEach(() => {
  pluginHooksDict.reset();
});

describe('preparePlugins', () => {
  it('requires every plugin to have a name or key', () => {
    expect(() => preparePlugins({ plugins: [{}] } as any)).toThrow(
      'plugin.name or plugin.key is required',
    );
  });

  it('keeps key-based plugins compatible through definePlugin', () => {
    const plugin = {
      key: 'legacy-plugin',
    };

    expect(definePlugin(plugin as any)).toBe(plugin);
    expect(plugin).toMatchObject({
      key: 'legacy-plugin',
      name: 'legacy-plugin',
    });
  });

  it('orders plugins by enforce and preserves source order inside each bucket', () => {
    const calls: string[] = [];
    const cfg = {
      env: 'dev',
      plugins: [
        {
          key: 'post',
          enforce: 'post',
          [PluginHooks.afterCompile]: () => calls.push('post'),
        },
        {
          key: 'normal-a',
          [PluginHooks.afterCompile]: () => calls.push('normal-a'),
        },
        {
          key: 'pre',
          enforce: 'pre',
          [PluginHooks.afterCompile]: () => calls.push('pre'),
        },
        {
          key: 'normal-b',
          [PluginHooks.afterCompile]: () => calls.push('normal-b'),
        },
      ],
    } as any;

    preparePlugins(cfg, 'build');

    expect(pluginHooksDict.getListener(PluginHooks.afterCompile).length).toBe(4);
    pluginHooksDict.getListener(PluginHooks.afterCompile).forEach(fn => fn(cfg));

    expect(calls).toEqual(['pre', 'normal-a', 'normal-b', 'post']);
  });

  it('filters plugins with apply before registering hooks', () => {
    const afterCompile = vi.fn();
    const cfg = {
      env: 'prod',
      plugins: [
        {
          key: 'dev-only',
          apply: 'dev',
          [PluginHooks.afterCompile]: afterCompile,
        },
      ],
    } as any;

    preparePlugins(cfg, 'build');

    expect(pluginHooksDict.getListener(PluginHooks.afterCompile)).toEqual([]);
  });

  it('supports apply callbacks for fine-grained activation', () => {
    const afterCompile = vi.fn();
    const cfg = {
      env: 'dev',
      plugins: [
        {
          key: 'conditional-plugin',
          apply: ({ command, env }) => command === 'dev' && env === 'dev',
          [PluginHooks.afterCompile]: afterCompile,
        },
      ],
    } as any;

    preparePlugins(cfg, 'dev');

    expect(pluginHooksDict.getListener(PluginHooks.afterCompile)).toHaveLength(1);
  });

  it('passes the activated context into onActivated', () => {
    const onActivated = vi.fn();
    const cfg = {
      env: 'dev',
      plugins: [
        {
          key: 'ctx-plugin',
          onActivated,
        },
      ],
    } as any;

    preparePlugins(cfg, 'dev');

    expect(onActivated).toHaveBeenCalledWith(
      cfg,
      expect.objectContaining({
        cfg,
        command: 'dev',
        bundler: undefined,
        env: 'dev',
      }),
    );
  });
});
