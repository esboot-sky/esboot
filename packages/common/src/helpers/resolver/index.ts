import { resolve as resolvePath, isAbsolute, dirname } from 'node:path';
import { getTsconfig } from 'get-tsconfig';

interface ResolveAliasOptions {
  targetPath: string;
  currentPath: string;
  tsconfigPath: string;
}

type Paths = Record<string, string[]>;

type ESMOpts = {
  specifier: string;
  basedir: string;
  baseUrl: string;
  paths: Paths;
  projectRoot: string;
};

export function resolveAlias(options: ResolveAliasOptions) {
  const { tsconfigPath, targetPath, currentPath } = options;
  const tsconfig = readTsconfig(tsconfigPath);
  const projectRoot = dirname(tsconfigPath);

  const resolvedPath = resolveImportSync({
    specifier: targetPath,
    basedir: dirname(currentPath),
    baseUrl: tsconfig.baseUrl,
    paths: tsconfig.paths,
    projectRoot,
  });

  console.log('resolvedPath--1', targetPath, resolvedPath);

  return resolvedPath || targetPath;
}

let cachedTsconfig: any;
function readTsconfig(tsconfigPath: string) {
  if (cachedTsconfig) return cachedTsconfig;

  try {
    const cfg = getTsconfig(tsconfigPath);
    const paths = cfg?.config?.compilerOptions?.paths ?? {};
    const baseUrl = cfg?.config?.compilerOptions?.baseUrl ?? '.';
    cachedTsconfig = { paths, baseUrl };
    return cachedTsconfig;
  } catch (error) {
    console.error('Error reading tsconfig', error);
    const fallback = { paths: {}, baseUrl: '.' };
    cachedTsconfig = fallback;
    return fallback;
  }
}

function resolveImportSync(opts: ESMOpts): string | null {
  const { specifier, basedir, baseUrl, paths, projectRoot } = opts;

  if (isAbsolute(specifier)) return specifier;

  if (specifier.startsWith('.')) {
    return resolvePath(basedir, specifier);
  }

  const [cleanSpecifier, queryParams] = specifier.split('?');

  const absBaseUrl = isAbsolute(baseUrl) ? baseUrl : resolvePath(projectRoot, baseUrl);

  for (const [aliasPattern, targetPaths] of Object.entries(paths)) {

    if (aliasPattern.includes('*')) {
      const prefix = aliasPattern.slice(0, aliasPattern.indexOf('*'));
      const suffix = aliasPattern.slice(aliasPattern.indexOf('*') + 1);

      if (cleanSpecifier.startsWith(prefix) && cleanSpecifier.endsWith(suffix)) {
        const wildcardMatch = cleanSpecifier.slice(prefix.length, cleanSpecifier.length - suffix.length);

        for (const targetPath of targetPaths) {
          const resolvedTarget = targetPath.replace('*', wildcardMatch);
          const fullPath = resolvePath(absBaseUrl, resolvedTarget);

          const result = queryParams ? `${fullPath}?${queryParams}` : fullPath;
          return result;
        }
      }
    } else {
      if (cleanSpecifier === aliasPattern) {
        for (const targetPath of targetPaths) {
          const fullPath = resolvePath(absBaseUrl, targetPath);
          const result = queryParams ? `${fullPath}?${queryParams}` : fullPath;
          return result;
        }
      }
    }
  }

  return null;
}