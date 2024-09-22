interface Command {
  name: string;
  description?: string;
  options?: string;
  details?: string;
  alias?: string | string[];
  action: (...args: any[]) => void;
}

export function registerCommands(command: Command[]) {
  const commands = Array.isArray(command) ? command : [command];

  console.log(commands);
}
