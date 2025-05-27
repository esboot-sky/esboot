import type { Configuration } from '@/cfg/types';
import { PluginHooks } from './constants';
import type { Plugin } from './type';

export const pluginHooksDict = new (class PluginHooksDict {
  state: Record<PluginHooks, any[]> = {
    [PluginHooks.registerCommands]: [],
    [PluginHooks.prepare]: [],
    [PluginHooks.modifyConfig]: [],
    [PluginHooks.modifyTypescriptConfig]: [],
    [PluginHooks.modifyPrettierConfig]: [],
    [PluginHooks.modifyStylelintConfig]: [],
    [PluginHooks.modifyEslintConfig]: [],
    [PluginHooks.modifyBundlerConfig]: [],
    [PluginHooks.afterCompile]: [],
  };

  addListener(key: PluginHooks, fn: any) {
    this.state[key].push(fn);
  }

  getListener(key: PluginHooks) {
    return this.state[key];
  }

  hasHookType(key: PluginHooks) {
    return key in this.state;
  }
})();

export const preparePlugins = (cfg: Configuration) => {
  const { plugins = [] } = cfg;

  for (const plugin of plugins) {
    const { key, onActivated, ...hooks } = plugin;

    if (!key) {
      throw new Error('plugin.key is required');
    }

    if (onActivated) onActivated(cfg);

    for (const key in hooks) {
      if (pluginHooksDict.hasHookType(key as PluginHooks)) {
        pluginHooksDict.addListener(
          key as PluginHooks,
          hooks[key as PluginHooks] as any
        );
      }
    }
  }
};

export function definePlugin(cfg: Plugin): Plugin {
  return cfg;
}

export * from './hooks-action';
export * from './constants';
