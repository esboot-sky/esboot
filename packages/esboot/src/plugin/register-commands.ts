import { program } from 'commander';
export interface Command {
  name: string;
  description?: string;
  options?: string[];
  action: (...args: any[]) => void;
}

export function registerCommands(commands: Command[]) {
  commands.forEach((command) => {
    const { name, description, options, action } = command;

    const cmd = program.command(name);

    if (Array.isArray(options)) {
      options.forEach((option) => {
        cmd.option(option);
      });
    }

    cmd.description(description || name).action(action);
  });
}
