import { Command } from 'commander';

export interface Plugin {
  key: string;
  registerCommands?: (program: Command) => void;
}
