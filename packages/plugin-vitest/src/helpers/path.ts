import { pathExistsSync } from 'fs-extra';
import { join, dirname } from 'path';

export function joinExecPath(path: string) {
  // pnpm
  const pnpmPath = join(__dirname, '../../', path);
  if (pathExistsSync(pnpmPath)) return pnpmPath;

  // bun
  const bunPath = join(process.cwd(), path);
  return bunPath;
}

export function searchCommand(command: string) {
  return joinExecPath(`./node_modules/.bin/${command}`);
}

const hyphen = process.platform === 'win32' ? '\\' : '/';

export function getAbsolutePath(libName: string) {
  try {
    return dirname(require.resolve(join(libName, 'package.json')));
  } catch (err) {
    // err: Package subpath './package.json' is not defined by "exports" in xx
    let currentPath = require.resolve(libName);
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
