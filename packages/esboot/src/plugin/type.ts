import type { Configuration } from '@/cfg/types';
import { PluginHooks } from './constants';
import type { Command } from './register-commands';

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
  [PluginHooks.modifyBundlerConfig]?: <T extends NormalConfig>(
    cfg: Configuration,
    bundlerConfig: T
  ) => Partial<T>;
  [PluginHooks.afterCompile]?: () => void;
}
