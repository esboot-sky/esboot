import type { Command } from '@dz-web/esboot-common/plugin';
import { program } from 'commander';

export function registerCommands(commands: Command[]): void {
  for (const command of commands) {
    const {
      name,
      arguments: args,
      description,
      options,
      allowUnknownOption,
      action,
    } = command;

    const cmd = program.command(name);

    if (allowUnknownOption)
      cmd.allowUnknownOption(true);

    if (Array.isArray(args)) {
      for (const argument of args) {
        cmd.argument(
          argument.name,
          argument.description,
          argument.defaultValue,
        );
      }
    }

    if (Array.isArray(options)) {
      for (const option of options) {
        cmd.option(option);
      }
    }

    cmd.description(description || name).action(action);
  }
}
