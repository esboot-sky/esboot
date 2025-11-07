import type { ConfigurationInstance } from '@dz-web/esboot';

export async function addPostcssPluginTailwindcss(cfg: ConfigurationInstance): Promise<any | false> {
  const { useTailwindcss } = cfg.config;

  if (!useTailwindcss)
    return false;
  return import('@tailwindcss/postcss').then(({ default: plugin }) => plugin());
}
