import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);

export async function importModuleFromCurrentPackage<T = any>(moduleName: string): Promise<T> {
  const modulePath = require.resolve(moduleName);

  return import(pathToFileURL(modulePath).href) as Promise<T>;
}
