import type { ConfigurationInstance } from '@dz-web/esboot';
import process from 'node:process';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { resolveTailwindConfig } from '@dz-web/esboot-common/cfg';
import { importModuleFromCurrentPackage } from './resolve-from-current-package';
import { importModuleFromPackage } from './resolve-from-package';

export async function addPostcssPluginTailwindcss(cfg: ConfigurationInstance): Promise<any | false> {
  const { enable, version } = resolveTailwindConfig(cfg.config);
  const { cwd = process.cwd() } = cfg.config;

  if (!enable)
    return false;

  if (version === '3') {
    return importModuleFromPackage<{ default: (tailwindConfig: Record<string, unknown>) => any }>(
      'tailwindcss',
      '@dz-web/esboot-plugin-tailwind3',
      cwd,
    ).then(async ({ default: plugin }) => {
      let tailwindConfig: Record<string, unknown>;

      try {
        const require = createRequire(resolve(cwd, 'package.json'));
        const cachedConfigPath = require.resolve('./node_modules/.cache/esboot/tailwindcss.config.js');
        delete require.cache[cachedConfigPath];
        tailwindConfig = require(cachedConfigPath);
      } catch (err) {
        const { tailwind3Config } = await importModuleFromPackage<{
          tailwind3Config: Record<string, unknown>;
        }>(
          '@dz-web/esboot-plugin-tailwind3',
          '@dz-web/esboot-plugin-tailwind3',
          cwd,
        );
        tailwindConfig = tailwind3Config;
      }

      return plugin(tailwindConfig);
    });
  }

  return importModuleFromCurrentPackage<{ default: () => any }>('@tailwindcss/postcss').then(
    ({ default: plugin }) => plugin(),
  );
}
