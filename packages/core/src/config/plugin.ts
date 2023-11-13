import { Command } from 'commander';

interface AfterCommandOfGenerateAliasReturn {
  alias?: Record<string, string>;
}

export interface Plugin {
  key: string;
  registerCommands?: (program: Command) => void;
  afterCommandOfGenerateAlias?: () => AfterCommandOfGenerateAliasReturn;
}
