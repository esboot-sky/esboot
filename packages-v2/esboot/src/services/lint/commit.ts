import spawn from 'cross-spawn';

import { searchCommand } from '@@/helpers/path';

export function runCommitLint(args: string[]) {
  const child = spawn(
    searchCommand('commitlint'),
    ['--from', 'HEAD~1', '--to', 'HEAD', ...args],
    {
      stdio: 'inherit',
      shell: true,
      cwd: process.cwd(),
    }
  );
}
