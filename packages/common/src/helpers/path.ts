import { join, dirname } from 'path';

import { isWins } from '../constants';

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
