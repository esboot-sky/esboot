import type { Configuration } from '@/cfg/types';
import cfg from '@/cfg';
import { PluginHooks } from './constants';

export interface Plugin {
  key: string;
  onActivated?: (cfg: Configuration) => void;
  [PluginHooks.registerCommands]?: (program: any) => void;
  [PluginHooks.modifyConfig]?: (
    config: Configuration,
    patch: (typeof cfg)['patch']
  ) => void;
  [PluginHooks.modifyTypescriptConfig]?: (config: Record<string, any>) => void;
  [PluginHooks.modifyPrettierConfig]?: (config: Record<string, any>) => void;
  [PluginHooks.modifyStylelintConfig]?: (config: Record<string, any>) => void;
  [PluginHooks.modifyEslintConfig]?: (config: Record<string, any>) => void;
  [PluginHooks.modifyBundlerConfig]?: (config: Record<string, any>) => void;
}
