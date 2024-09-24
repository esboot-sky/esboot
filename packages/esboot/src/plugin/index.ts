import type { Configuration } from '@/cfg/types';
import { PluginHooks } from './constants';

export const pluginHooksDict: Record<PluginHooks, any[]> = {
  [PluginHooks.registerCommands]: [],
  [PluginHooks.modifyConfig]: [],
  [PluginHooks.modifyTypescriptConfig]: [],
  [PluginHooks.modifyPrettierConfig]: [],
  [PluginHooks.modifyStylelintConfig]: [],
  [PluginHooks.modifyEslintConfig]: [],
  [PluginHooks.modifyBundlerConfig]: [],
  [PluginHooks.afterCompile]: [],
};

export const preparePlugins = (cfg: Configuration) => {
  const { plugins = [] } = cfg;

  console.log(23, 'preparePlugins');
  
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

  console.log(pluginHooksDict, 'preparePlugins');
};

export * from './hooks-action';
export * from './constants';
