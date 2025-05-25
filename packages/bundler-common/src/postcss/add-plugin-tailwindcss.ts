import type { ConfigurationInstance } from '@dz-web/esboot';

export function addPostcssPluginTailwindcss(cfg: ConfigurationInstance) {
  const { useTailwindcss } = cfg.config;

  if (!useTailwindcss) return false;

  return require('@tailwindcss/postcss');
}
