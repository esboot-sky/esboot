import spawn from 'cross-spawn';

import { searchCommand } from '@@/helpers/path';
import { resolve } from 'path';

export function runLint(args: string[]) {
  spawn.sync(
    searchCommand('stylelint'),
    ['**/*.scss', ...args],
    {
      stdio: 'inherit',
      shell: true,
    }
  );

  spawn.sync(
    searchCommand('eslint'),
    ['--ext', '.jsx,.js,.ts,.tsx', resolve(process.cwd(), 'src/'), ...args],
    {
      stdio: 'inherit',
      shell: true,
    }
  );
}
