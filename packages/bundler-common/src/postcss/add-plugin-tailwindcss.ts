import type { ConfigurationInstance } from '@dz-web/esboot';

export const addPostcssPluginTailwindcss = async (
  cfg: ConfigurationInstance
) => {
  const { useTailwindcss } = cfg.config;

  if (!useTailwindcss) return false;
  return import('@tailwindcss/postcss').then(({ default: plugin }) => plugin());
};
