import type { ConfigurationInstance } from '@dz-web/esboot';
import process from 'node:process';
import { resolveTailwindConfig } from '@dz-web/esboot-common/cfg';
import { importModuleFromCwd } from './resolve-from-cwd';
import { importModuleFromPackage } from './resolve-from-package';

export async function addPostcssPluginTailwindcss(cfg: ConfigurationInstance): Promise<any | false> {
  const { enable, version } = resolveTailwindConfig(cfg.config);
  const { cwd = process.cwd() } = cfg.config;

  if (!enable)
    return false;

  if (version === '3') {
    return importModuleFromPackage<{ default: () => any }>(
      'tailwindcss',
      '@dz-web/esboot-plugin-tailwind3',
      cwd,
    ).then(({ default: plugin }) => plugin());
  }

  return importModuleFromCwd<{ default: () => any }>('@tailwindcss/postcss', cwd).then(({ default: plugin }) => plugin());
}
