import spawn from 'cross-spawn';
import { searchCommand } from '@@/helpers/path';

export async function runDocs(action: string[]) {
  spawn.sync(
    `${searchCommand('cross-env')} APP_ROOT='./docs' ${searchCommand('dumi')}`,
    action,
    { stdio: 'inherit', shell: true }
  );
}
