import type { Plugin } from '@dz-web/esboot-common/plugin';
import type { Configuration } from '@/cfg';
import { PluginHooks } from '@dz-web/esboot-common/plugin';

export const pluginHooksDict = new (class PluginHooksDict {
  state: Record<PluginHooks, any[]> = this.createState();

  createState(): Record<PluginHooks, any[]> {
    return {
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
  }

  reset(): void {
    this.state = this.createState();
  }

  addListener(key: PluginHooks, fn: any): void {
    this.state[key].push(fn);
  }

  getListener(key: PluginHooks): any[] {
    return this.state[key];
  }

  hasHookType(key: PluginHooks): boolean {
    return key in this.state;
  }
})();

export function preparePlugins(cfg: Configuration): void {
  const { plugins = [] } = cfg;

  pluginHooksDict.reset();

  for (const plugin of plugins) {
    const { key, onActivated, ...hooks } = plugin;

    if (!key) {
      throw new Error('plugin.key is required');
    }

    if (onActivated)
      onActivated(cfg);

    for (const key in hooks) {
      if (pluginHooksDict.hasHookType(key as PluginHooks)) {
        pluginHooksDict.addListener(
          key as PluginHooks,
          hooks[key as PluginHooks] as any,
        );
      }
    }
  }
}

export function definePlugin(cfg: Plugin): Plugin {
  return cfg;
}

export * from './hooks-action';
