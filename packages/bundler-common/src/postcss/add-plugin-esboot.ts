import type { ConfigurationInstance } from '@dz-web/esboot';

export const addPostcssPluginESBoot = async (cfg: ConfigurationInstance) => {
  const { useTailwindcss } = cfg.config;

  // @ts-ignore
  return import('@dz-web/postcss-plugin-esboot').then(({ default: plugin }) =>
    plugin({
      useTailwindcss,
    })
  );
};
