import type { Command, Plugin, PluginContext } from '@dz-web/esboot-common/plugin';
import type { Configuration } from '@/cfg';
import { mergeWith } from '@dz-web/esboot-common/lodash';
import { PluginHooks } from '@dz-web/esboot-common/plugin';

import { cfg } from '@/cfg';
import { pluginHooksDict } from './index';
import { registerCommands } from './register-commands';

function getContext(cfg: Configuration, bundlerName?: string): PluginContext {
  const context = pluginHooksDict.state?.context;

  if (!context) {
    return {
      cfg,
      command: 'config',
      env: cfg.env,
      bundler: bundlerName,
      logger: console,
    };
  }

  return {
    ...context,
    cfg,
    bundler: bundlerName,
  };
}

export function callPluginHookOfModifyLintConfig(
  hook: PluginHooks,
  cfg: Configuration,
  result: Record<string, any>,
): void {
  pluginHooksDict.getListener(hook).forEach((fn) => {
    const nextResult = fn(cfg, result, getContext(cfg));
    Object.assign(
      result,
      mergeWith(result, nextResult, (objValue, srcValue) => {
        if (Array.isArray(objValue) && Array.isArray(srcValue)) {
          return [...objValue, ...srcValue];
        }
      }),
    );
  });
}

export function callPluginHookOfModifyConfig(...args: Parameters<Required<Plugin>[PluginHooks.modifyConfig]>): void {
  const [config] = args;

  pluginHooksDict.getListener(PluginHooks.modifyConfig).forEach((fn) => {
    cfg.patch(fn(config as any, getContext(config as any)));
  });
}

export function callPluginHookOfRegisterCommands(...args: Parameters<Required<Plugin>[PluginHooks.registerCommands]>): void {
  const commands: Command[] = [];
  const context = getContext(args[0] as any);
  pluginHooksDict.getListener(PluginHooks.registerCommands).forEach((fn) => {
    commands.push(...fn(args[0] as any, context));
  });

  registerCommands(commands);
}

export function callPluginHookOfModifyBundlerConfig<T>(dict: typeof pluginHooksDict, cfg: Configuration, bundlerConfig: T, bundlerName: string): void {
  dict.getListener(PluginHooks.modifyBundlerConfig).forEach((fn) => {
    fn(cfg as any, bundlerConfig, bundlerName, getContext(cfg as any, bundlerName));
  });
}

export function callPluginHookOfOnlyExec(name: PluginHooks, dict: typeof pluginHooksDict, cfg: Configuration): void {
  dict.getListener(name).forEach((fn) => {
    fn(cfg as any, getContext(cfg as any));
  });
}
