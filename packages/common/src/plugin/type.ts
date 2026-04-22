import type { PluginHooks } from './constants';
import type { Configuration } from '@/cfg/types';
import type { Environment } from '@/constants';

export interface Command {
  name: string;
  arguments?: {
    name: string;
    description: string;
    defaultValue?: unknown;
  }[];
  description?: string;
  allowUnknownOption?: boolean;
  passThroughOptions?: boolean;
  options?: string[];
  action: (...args: any[]) => void;
}

type NormalConfig = Record<string, any>;

export interface PluginCommandContext {
  cfg: Configuration;
  command: string;
  bundler?: string;
  env: Environment;
}

export interface PluginContext extends PluginCommandContext {
  logger: {
    info: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
    debug: (...args: any[]) => void;
  };
}

export type PluginApply = boolean | 'always' | 'never' | 'dev' | 'build' | 'prepare' | 'preview' | ((ctx: PluginCommandContext) => boolean);

export interface Plugin {
  name?: string;
  key?: string;
  enforce?: 'pre' | 'post';
  apply?: PluginApply;
  onActivated?: (cfg: Configuration, ctx: PluginContext) => void;
  [PluginHooks.modifyConfig]?: (
    config: Configuration,
    ctx: PluginContext,
  ) => Partial<Configuration>;
  [PluginHooks.registerCommands]?: (
    cfg: Configuration,
    ctx: PluginContext,
  ) => Command[];
  [PluginHooks.modifyTypescriptConfig]?: (
    cfg: Configuration,
    tsconfig: NormalConfig,
    ctx: PluginContext,
  ) => Partial<NormalConfig>;
  [PluginHooks.modifyPrettierConfig]?: (
    cfg: Configuration,
    prettierConfig: NormalConfig,
    ctx: PluginContext,
  ) => Partial<NormalConfig>;
  [PluginHooks.modifyStylelintConfig]?: (
    cfg: Configuration,
    stylelintConfig: NormalConfig,
    ctx: PluginContext,
  ) => Partial<NormalConfig>;
  [PluginHooks.modifyEslintConfig]?: (
    cfg: Configuration,
    eslintConfig: NormalConfig,
    ctx: PluginContext,
  ) => Partial<NormalConfig>;
  [PluginHooks.modifyBundlerConfig]?: (
    cfg: Configuration,
    bundlerConfig: NormalConfig,
    bundlerName: string,
    ctx: PluginContext,
  ) => void;
  [PluginHooks.afterCompile]?: (cfg: Configuration, ctx: PluginContext) => void;
  [PluginHooks.prepare]?: (cfg: Configuration, ctx: PluginContext) => void;
}
