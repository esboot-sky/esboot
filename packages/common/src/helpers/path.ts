import { join, dirname } from 'node:path';
import { pathExistsSync } from 'fs-extra/esm';

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

// requireResolve: passthrough require.resolve
export function resolveLibPath(
  libName: string,
  requireResolve: ImportMeta['resolve'],
  relativePath = ''
) {
  let libPath = '';

  try {
    libPath = dirname(requireResolve(join(libName, 'package.json')));
  } catch (err) {
    // err: Package subpath './package.json' is not defined by "exports" in xx
    libPath = requireResolve(libName);
    let isRootPath = false;
    // For windows path
    const compatibleLibName = libName.replace('/', hyphen);

    while (
      !libPath.endsWith(`${hyphen}${compatibleLibName}`) &&
      !isRootPath
    ) {
      const path = dirname(libPath);

      // Prevent endless loop
      if (libPath !== path) {
        libPath = path;
      } else {
        isRootPath = true;
      }
    }

    return libPath;
  }

  return relativePath ? join(libPath, relativePath) : libPath;
}
