import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export async function importModuleFromProject<T = any>(moduleName: string, cwd: string): Promise<T> {
  const require = createRequire(resolve(cwd, 'package.json'));
  const modulePath = require.resolve(moduleName);

  return import(pathToFileURL(modulePath).href) as Promise<T>;
}
