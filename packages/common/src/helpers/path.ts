import { pathExistsSync } from 'fs-extra';
import { join, dirname } from 'path';

import { isWins } from '../constants';

export function joinExecPath(currPath: string, path: string) {
  // pnpm
  const pnpmPath = join(currPath, path);
  if (pathExistsSync(pnpmPath)) return pnpmPath;

  // bun
  const bunPath = join(process.cwd(), path);
  return bunPath;
}

export function searchCommand(currPath: string, command: string) {
  return joinExecPath(currPath, `./node_modules/.bin/${command}`);
}

const hyphen = isWins ? '\\' : '/';

// requireResolve: 转发require.resolve
export function getAbsolutePath(
  libName: string,
  requireResolve: typeof require.resolve
) {
  try {
    return dirname(requireResolve(join(libName, 'package.json')));
  } catch (err) {
    // err: Package subpath './package.json' is not defined by "exports" in xx
    let currentPath = requireResolve(libName);
    let isRootPath = false;
    // For windows path
    const compatibleLibName = libName.replace('/', hyphen);

    while (
      !currentPath.endsWith(`${hyphen}${compatibleLibName}`) &&
      !isRootPath
    ) {
      const path = dirname(currentPath);

      // Prevent endless loop
      if (currentPath !== path) {
        currentPath = path;
      } else {
        isRootPath = true;
      }
    }

    return currentPath;
  }
}
