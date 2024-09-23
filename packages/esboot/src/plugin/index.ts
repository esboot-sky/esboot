import type { Configuration } from '@/cfg/types';
import { PluginHooks } from './constants';
import { registerCommands, type Command } from './register-commands';
import type { Plugin } from './type';

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
  switch (hook) {
    case PluginHooks.registerCommands:
      const commands: Command[] = [];
      pluginHooksDict[hook].forEach((fn) => {
        commands.push(...fn(...args));
      });

      registerCommands(commands);
      break;
    default:
      pluginHooksDict[hook].forEach((fn) => fn(...args));
  }
};
