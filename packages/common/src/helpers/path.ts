import { dirname, join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { pathExistsSync } from 'fs-extra/esm';
import { isWins } from '../constants';

export function createResolvePath(importMetaResolve: ImportMeta['resolve']) {
  return (p: string): string => fileURLToPath(importMetaResolve(p));
}

export function resolvePathFromUrl(p: string, importMetaResolve: ImportMeta['resolve']): string {
  return fileURLToPath(importMetaResolve(p));
}

export function joinExecPath(currPath: string, path: string): string {
  // pnpm
  const pnpmPath = join(currPath, path);
  if (pathExistsSync(pnpmPath))
    return pnpmPath;

  // bun
  const bunPath = join(process.cwd(), path);
  return bunPath;
}

export function searchCommand(currPath: string, command: string): string {
  return joinExecPath(currPath, `./node_modules/.bin/${command}`);
}

const hyphen = isWins ? '\\' : '/';

// requireResolve: passthrough require.resolve
export function resolveLibPath(
  libName: string,
  requireResolve: ImportMeta['resolve'],
  relativePath = '',
): string {
  let libPath = '';

  try {
    libPath = dirname(fileURLToPath(requireResolve(`${libName}/package.json`)));
  }
  catch {
    // err: Package subpath './package.json' is not defined by "exports" in xx
    libPath = fileURLToPath(requireResolve(libName));
    let isRootPath = false;
    // For windows path
    const compatibleLibName = libName.replace('/', hyphen);

    while (
      !libPath.endsWith(`${hyphen}${compatibleLibName}`)
      && !isRootPath
    ) {
      const path = dirname(libPath);

      // Prevent endless loop
      if (libPath !== path) {
        libPath = path;
      }
      else {
        isRootPath = true;
      }
    }
  }

  return relativePath ? join(libPath, relativePath) : libPath;
}
