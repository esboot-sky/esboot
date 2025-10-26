import type { PluginHooks } from './constants';
import type { Configuration } from '@/cfg/types';

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
export interface Plugin {
  key: string;
  onActivated?: (cfg: Configuration) => void;
  [PluginHooks.modifyConfig]?: (
    config: Configuration
  ) => Partial<Configuration>;
  [PluginHooks.registerCommands]?: (cfg: Configuration) => Command[];
  [PluginHooks.modifyTypescriptConfig]?: (
    cfg: Configuration,
    tsconfig: NormalConfig
  ) => Partial<NormalConfig>;
  [PluginHooks.modifyPrettierConfig]?: (
    cfg: Configuration,
    prettierConfig: NormalConfig
  ) => Partial<NormalConfig>;
  [PluginHooks.modifyStylelintConfig]?: (
    cfg: Configuration,
    stylelintConfig: NormalConfig
  ) => Partial<NormalConfig>;
  [PluginHooks.modifyEslintConfig]?: (
    cfg: Configuration,
    eslintConfig: NormalConfig
  ) => Partial<NormalConfig>;
  [PluginHooks.modifyBundlerConfig]?: (
    cfg: Configuration,
    bundlerConfig: NormalConfig,
    bundlerName: string
  ) => void;
  [PluginHooks.afterCompile]?: (cfg: Configuration) => void;
  [PluginHooks.prepare]?: (cfg: Configuration) => void;
}
