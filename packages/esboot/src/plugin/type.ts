import type { Configuration } from '@/cfg/types';
import cfg from '@/cfg';
import { PluginHooks } from './constants';
import type { Command } from './register-commands';

export interface Plugin {
  key: string;
  onActivated?: (cfg: Configuration) => void;
  [PluginHooks.modifyConfig]?: (
    config: Configuration,
    patch: (typeof cfg)['patch']
  ) => void;
  [PluginHooks.registerCommands]?: (cfg: Configuration) => Command[];
  [PluginHooks.modifyTypescriptConfig]?: (config: Record<string, any>) => void;
  [PluginHooks.modifyPrettierConfig]?: (config: Record<string, any>) => void;
  [PluginHooks.modifyStylelintConfig]?: (config: Record<string, any>) => void;
  [PluginHooks.modifyEslintConfig]?: (config: Record<string, any>) => void;
  [PluginHooks.modifyBundlerConfig]?: (config: Record<string, any>) => void;
  [PluginHooks.afterCompile]?: () => void;
}
