import { pathExistsSync } from 'fs-extra';
import { join } from 'path';

export function joinExecPath(path: string) {
  // pnpm
  const pnpmPath = join(__dirname, '../../', path);
  if (pathExistsSync(pnpmPath)) return pnpmPath;

  // bun
  const bunPath = join(process.cwd(), path);
  return bunPath;
}

export function searchCommand(command: string) {
  console.log(joinExecPath(`./node_modules/.bin/${command}`), '<-- command');
  return joinExecPath(`./node_modules/.bin/${command}`);
};
