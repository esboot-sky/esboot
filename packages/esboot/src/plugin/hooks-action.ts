import { merge } from '@dz-web/esboot-common/lodash';
import cfg from '@/cfg';
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
  pluginHooksDict.getListener(hook).forEach((fn) => {
    result = merge(result, fn(cfg, result));
  });
}

export const callPluginHookOfModifyConfig = (
  ...args: Parameters<Required<Plugin>[PluginHooks.modifyConfig]>
) => {
  const [config] = args;

  pluginHooksDict.getListener(PluginHooks.modifyConfig).forEach((fn) => {
    cfg.patch(fn(config));
  });
};

export const callPluginHookOfRegisterCommands = (
  ...args: Parameters<Required<Plugin>[PluginHooks.registerCommands]>
) => {
  const commands: Command[] = [];
  pluginHooksDict.getListener(PluginHooks.registerCommands).forEach((fn) => {
    commands.push(...fn(...args));
  });

  registerCommands(commands);
};

export const callPluginHookOfModifyBundlerConfig = <T>(
  dict: typeof pluginHooksDict,
  cfg: Configuration,
  bundlerConfig: T,
  bundlerName: string
) => {
  dict.getListener(PluginHooks.modifyBundlerConfig).forEach((fn) => {
    fn(cfg, bundlerConfig, bundlerName);
  });
};

export const callPluginHookOfOnlyExec = (
  name: PluginHooks,
  dict: typeof pluginHooksDict,
  cfg: Configuration
) => {
  dict.getListener(name).forEach((fn) => {
    fn(cfg);
  });
};
