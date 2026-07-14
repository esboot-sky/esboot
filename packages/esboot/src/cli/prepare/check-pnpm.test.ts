import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { execSync } from 'node:child_process';
import { checkPnpmVersion } from './check-pnpm';
import process from 'node:process';

vi.mock('node:child_process', () => ({
  execSync: vi.fn(),
}));

describe('checkPnpmVersion', () => {
  let exitSpy: any;
  let consoleErrorSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    exitSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('passes when pnpm version is 10 or higher', () => {
    vi.mocked(execSync).mockReturnValue(Buffer.from('10.2.0\n'));
    expect(() => checkPnpmVersion()).not.toThrow();
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it('fails when pnpm version is less than 10', () => {
    vi.mocked(execSync).mockReturnValue(Buffer.from('9.15.2\n'));
    expect(() => checkPnpmVersion()).toThrow('process.exit called');
    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Your pnpm version 9.15.2 is not supported')
    );
  });

  it('fails when pnpm version check throws an error', () => {
    vi.mocked(execSync).mockImplementation(() => {
      throw new Error('Command not found');
    });
    expect(() => checkPnpmVersion()).toThrow('process.exit called');
    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('pnpm is not installed or could not be run')
    );
  });
});
