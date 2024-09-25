import { program } from 'commander';
export interface Command {
  name: string;
  description?: string;
  allowUnknownOption?: boolean;
  options?: string[];
  action: (...args: any[]) => void;
}

export function registerCommands(commands: Command[]) {
  commands.forEach((command) => {
    const { name, description, options, allowUnknownOption, action } = command;

    const cmd = program.command(name);

    if (allowUnknownOption) cmd.allowUnknownOption(true);
    if (Array.isArray(options)) {
      options.forEach((option) => {
        cmd.option(option);
      });
    }

    cmd.description(description || name).action(action);
  });
}
