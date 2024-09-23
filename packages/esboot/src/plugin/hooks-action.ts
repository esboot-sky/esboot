import { merge } from '@dz-web/esboot-common/lodash';
import { PluginHooks } from './constants';
import { pluginHooksDict } from './index';
import { registerCommands, type Command } from './register-commands';

import type { Configuration } from '@/cfg/types';
import type { Plugin } from './type';

export function callPluginHookOfModifyLintConfig(
  hook: PluginHooks,
  cfg: Configuration,
  result: Record<string, any>
) {
  pluginHooksDict[hook].forEach((fn) => {
    result = merge(result, fn(cfg, result));
  });
}

export const callPluginHookOfModifyConfig = (
  ...args: Parameters<Required<Plugin>[PluginHooks.modifyConfig]>
) => {
  const [config, patch] = args;

  pluginHooksDict[PluginHooks.modifyConfig].forEach((fn) => {
    patch(fn(config));
  });
};

export const callPluginHookOfRegisterCommands = (
  ...args: Parameters<Required<Plugin>[PluginHooks.registerCommands]>
) => {
  const commands: Command[] = [];
  pluginHooksDict[PluginHooks.registerCommands].forEach((fn) => {
    commands.push(...fn(...args));
  });

  console.log(commands, 'commands');

  registerCommands(commands);
};

export const callPluginHookOfModifyTypescriptConfig = (
  hook: PluginHooks,
  ...args: Parameters<Required<Plugin>[PluginHooks.modifyTypescriptConfig]>
) => {
  pluginHooksDict[hook].forEach((fn) => {
    fn(...args);
  });
};
