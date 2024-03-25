import { Command } from 'commander';

import type { CustomWebpack } from './types';

interface AfterCommandOfGenerateAliasReturn {
  alias?: Record<string, string>;
  tsConfig?: Record<string, any>;
}

export interface Plugin {
  key: string;
  registerCommands?: (program: Command) => void;
  afterCommandOfGenerateAlias?: () => AfterCommandOfGenerateAliasReturn;
  customWebpack?: CustomWebpack;
}
