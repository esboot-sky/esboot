import type { Command, Plugin } from '@dz-web/esboot-common/plugin';
import type { Configuration } from '@/cfg';
import { merge } from '@dz-web/esboot-common/lodash';
import { PluginHooks } from '@dz-web/esboot-common/plugin';

import { cfg } from '@/cfg';
import { pluginHooksDict } from './index';
import { registerCommands } from './register-commands';

export function callPluginHookOfModifyLintConfig(
  hook: PluginHooks,
  cfg: Configuration,
  result: Record<string, any>,
): void {
  pluginHooksDict.getListener(hook).forEach((fn) => {
    result = merge(result, fn(cfg, result));
  });
}

export function callPluginHookOfModifyConfig(...args: Parameters<Required<Plugin>[PluginHooks.modifyConfig]>): void {
  const [config] = args;

  pluginHooksDict.getListener(PluginHooks.modifyConfig).forEach((fn) => {
    cfg.patch(fn(config));
  });
}

export function callPluginHookOfRegisterCommands(...args: Parameters<Required<Plugin>[PluginHooks.registerCommands]>): void {
  const commands: Command[] = [];
  pluginHooksDict.getListener(PluginHooks.registerCommands).forEach((fn) => {
    commands.push(...fn(...args));
  });

  registerCommands(commands);
}

export function callPluginHookOfModifyBundlerConfig<T>(dict: typeof pluginHooksDict, cfg: Configuration, bundlerConfig: T, bundlerName: string): void {
  dict.getListener(PluginHooks.modifyBundlerConfig).forEach((fn) => {
    fn(cfg, bundlerConfig, bundlerName);
  });
}

export function callPluginHookOfOnlyExec(name: PluginHooks, dict: typeof pluginHooksDict, cfg: Configuration): void {
  dict.getListener(name).forEach((fn) => {
    fn(cfg);
  });
}
