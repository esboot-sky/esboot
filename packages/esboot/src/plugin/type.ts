import type { Configuration } from '@/cfg/types';
import cfg from '@/cfg';
import { PluginHooks } from './constants';
import type { Command } from './register-commands';

type NormalLintConfig = Record<string, any>;
export interface Plugin {
  key: string;
  onActivated?: (cfg: Configuration) => void;
  [PluginHooks.modifyConfig]?: (
    config: Configuration,
    patch: (typeof cfg)['patch']
  ) => Partial<Configuration>;
  [PluginHooks.registerCommands]?: (cfg: Configuration) => Command[];
  [PluginHooks.modifyTypescriptConfig]?: (
    cfg: Configuration,
    tsconfig: NormalLintConfig
  ) => Partial<NormalLintConfig>;
  [PluginHooks.modifyPrettierConfig]?: (
    cfg: Configuration,
    prettierConfig: NormalLintConfig
  ) => Partial<NormalLintConfig>;
  [PluginHooks.modifyStylelintConfig]?: (
    cfg: Configuration,
    stylelintConfig: NormalLintConfig
  ) => Partial<NormalLintConfig>;
  [PluginHooks.modifyEslintConfig]?: (
    cfg: Configuration,
    eslintConfig: NormalLintConfig
  ) => Partial<NormalLintConfig>;
  [PluginHooks.modifyBundlerConfig]?: (
    cfg: Configuration,
    bundlerConfig: NormalLintConfig
  ) => Partial<NormalLintConfig>;
  [PluginHooks.afterCompile]?: () => void;
}
