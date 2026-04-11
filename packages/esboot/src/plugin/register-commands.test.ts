import { describe, expect, it, vi } from 'vitest';

const action = vi.fn();
const option = vi.fn().mockReturnThis();
const argument = vi.fn().mockReturnThis();
const description = vi.fn().mockReturnThis();
const allowUnknownOption = vi.fn().mockReturnThis();
const passThroughOptions = vi.fn().mockReturnThis();
const actionMethod = vi.fn().mockReturnThis();
const command = vi.fn(() => ({
  option,
  argument,
  description,
  allowUnknownOption,
  passThroughOptions,
  action: actionMethod,
}));

vi.mock('commander', () => ({
  program: {
    command,
  },
}));

describe('registerCommands', () => {
  it('registers command arguments, options, and flags onto commander', async () => {
    const { registerCommands } = await import('./register-commands');

    registerCommands([
      {
        name: 'docs',
        description: 'Start docs',
        arguments: [
          {
            name: '[subCommand]',
            description: 'the sub command',
            defaultValue: 'dev',
          },
        ],
        options: ['-p, --port <port>'],
        allowUnknownOption: true,
        passThroughOptions: true,
        action,
      },
    ]);

    expect(command).toHaveBeenCalledWith('docs');
    expect(allowUnknownOption).toHaveBeenCalledWith(true);
    expect(passThroughOptions).toHaveBeenCalledWith(true);
    expect(argument).toHaveBeenCalledWith('[subCommand]', 'the sub command', 'dev');
    expect(option).toHaveBeenCalledWith('-p, --port <port>');
    expect(description).toHaveBeenCalledWith('Start docs');
    expect(actionMethod).toHaveBeenCalledWith(action);
  });
});
