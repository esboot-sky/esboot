import type { ConfigurationInstance } from '@dz-web/esboot';
import process from 'node:process';
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
      const { tailwind3Config } = await importModuleFromPackage<{
        tailwind3Config: Record<string, unknown>;
      }>(
        '@dz-web/esboot-plugin-tailwind3',
        '@dz-web/esboot-plugin-tailwind3',
        cwd,
      );

      return plugin(tailwind3Config);
    });
  }

  return importModuleFromCurrentPackage<{ default: () => any }>('@tailwindcss/postcss').then(
    ({ default: plugin }) => plugin(),
  );
}
