import type { Configuration } from '@/cfg/types';
import { PluginHooks } from './constants';
import type { Plugin } from './type';
export const pluginHooksDict: Record<PluginHooks, any[]> = {
  [PluginHooks.registerCommands]: [],
  [PluginHooks.modifyConfig]: [],
  [PluginHooks.modifyTypescriptConfig]: [],
  [PluginHooks.modifyPrettierConfig]: [],
  [PluginHooks.modifyStylelintConfig]: [],
  [PluginHooks.modifyEslintConfig]: [],
  [PluginHooks.modifyBundlerConfig]: [],
};

export const preparePlugins = (cfg: Configuration) => {
  const { plugins = [] } = cfg;

  plugins.forEach((plugin) => {
    const { key, onActivated, ...hooks } = plugin;

    if (!key) {
      throw new Error('plugin.key is required');
    }

    if (onActivated) onActivated(cfg);

    for (const key in hooks) {
      if (key in pluginHooksDict) {
        pluginHooksDict[key as PluginHooks].push(hooks[key as PluginHooks]);
      }
    }
  });
};

export const callPluginHooks = <T extends PluginHooks>(
  hook: T,
  ...args: Parameters<Required<Plugin>[T]>
) => {
  pluginHooksDict[hook].forEach((fn) => fn(...args));
};
