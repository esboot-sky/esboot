import type { ConfigurationInstance } from '@dz-web/esboot';

export function addPostcssPluginESBoot(cfg: ConfigurationInstance) {
  const { useTailwindcss } = cfg.config;

  return require('@dz-web/postcss-plugin-esboot')({
    useTailwindcss,
  });
}
