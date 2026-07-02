import type { Plugin, PluginApply, PluginCommandContext, PluginContext } from '@dz-web/esboot-common/plugin';
import type { Configuration } from '@/cfg';
import { Environment } from '@dz-web/esboot-common/constants';
import { debug, error, info, warn } from '@dz-web/esboot-common/helpers';
import { PluginHooks } from '@dz-web/esboot-common/plugin';

type HookName = PluginHooks;

interface ResolvedPlugin extends Plugin {
  name: string;
  sourceIndex: number;
}

function createLogger(prefix = '[esboot-plugin]'): PluginContext['logger'] {
  return {
    info: (...args: any[]) => info(prefix, ...args.map(String)),
    warn: (...args: any[]) => warn(prefix, ...args.map(String)),
    error: (...args: any[]) => error(prefix, ...args.map(String)),
    debug: (...args: any[]) => debug(prefix, ...args.map(String)),
  };
}

function createPluginContext(
  cfg: Configuration,
  command: string,
  bundler?: string,
): PluginContext {
  return {
    cfg,
    command,
    bundler,
    env: cfg.env || Environment.dev,
    logger: createLogger(),
  };
}

function getPluginName(plugin: Plugin): string {
  return plugin.name || plugin.key || '';
}

function normalizeApplyResult(apply: PluginApply | undefined, ctx: PluginCommandContext): boolean {
  if (apply === undefined || apply === true || apply === 'always') {
    return true;
  }
  if (apply === false || apply === 'never') {
    return false;
  }
  if (apply === 'dev') {
    return ctx.env === Environment.dev || ctx.command === 'dev';
  }
  if (apply === 'build') {
    return ctx.command === 'build' || ctx.env === Environment.prod;
  }
  if (apply === 'prepare') {
    return ctx.command === 'prepare';
  }
  if (apply === 'preview') {
    return ctx.command === 'preview';
  }

  return apply(ctx);
}

function sortPlugins(plugins: ResolvedPlugin[]): ResolvedPlugin[] {
  const rank = (plugin: ResolvedPlugin): number => {
    if (plugin.enforce === 'pre') {
      return -1;
    }
    if (plugin.enforce === 'post') {
      return 1;
    }
    return 0;
  };

  return [...plugins].sort((left, right) => {
    const diff = rank(left) - rank(right);
    return diff !== 0 ? diff : left.sourceIndex - right.sourceIndex;
  });
}

function hasHook(plugin: ResolvedPlugin, hook: HookName): boolean {
  return typeof plugin[hook] === 'function';
}

export const pluginHooksDict = new (class PluginHooksDict {
  state: {
    plugins: ResolvedPlugin[];
    context: PluginContext | null;
  } = this.createState();

  createState(): {
    plugins: ResolvedPlugin[];
    context: PluginContext | null;
  } {
    return {
      plugins: [],
      context: null,
    };
  }

  reset(): void {
    this.state = this.createState();
  }

  setContext(ctx: PluginContext): void {
    this.state.context = ctx;
  }

  setPlugins(plugins: ResolvedPlugin[]): void {
    this.state.plugins = plugins;
  }

  getPlugins(): ResolvedPlugin[] {
    return this.state.plugins;
  }

  addListener(key: HookName, fn: unknown): void {
    const plugin = this.state.plugins.at(-1);
    if (!plugin) {
      return;
    }
    if (!fn || typeof fn !== 'function') {
      return;
    }
    (plugin as Record<string, any>)[key] = fn;
  }

  getListener(key: HookName): any[] {
    return this.state.plugins
      .filter(plugin => hasHook(plugin, key))
      .map(plugin => (plugin as Record<string, any>)[key]);
  }

  hasHookType(key: HookName): boolean {
    return Object.values(PluginHooks).includes(key);
  }
})();

export function preparePlugins(cfg: Configuration, command = 'config'): void {
  const { plugins = [] } = cfg;

  pluginHooksDict.reset();

  const context = createPluginContext(cfg, command);
  pluginHooksDict.setContext(context);

  const resolvedPlugins = sortPlugins(
    plugins.map((plugin, index) => {
      const name = getPluginName(plugin);

      if (!name) {
        throw new Error('plugin.name or plugin.key is required');
      }

      return {
        ...plugin,
        name,
        sourceIndex: index,
      };
    }),
  ).filter(plugin => normalizeApplyResult(plugin.apply, context));

  pluginHooksDict.setPlugins(resolvedPlugins);

  for (const plugin of resolvedPlugins) {
    plugin.onActivated?.(cfg, context);
  }
}

export function definePlugin(cfg: Plugin): Plugin {
  if (!cfg.name && cfg.key) {
    cfg.name = cfg.key;
  }

  return cfg;
}

export * from './hooks-action';
export * from './builtin/entry-log';

