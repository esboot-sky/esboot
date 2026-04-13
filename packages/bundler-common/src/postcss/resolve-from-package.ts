import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export async function importModuleFromPackage<T = any>(
  moduleName: string,
  packageName: string,
  cwd: string,
): Promise<T> {
  const require = createRequire(resolve(cwd, 'package.json'));
  const packageJsonPath = require.resolve(`${packageName}/package.json`);
  const packageRequire = createRequire(packageJsonPath);
  const modulePath = packageRequire.resolve(moduleName);

  return import(pathToFileURL(modulePath).href) as Promise<T>;
}
