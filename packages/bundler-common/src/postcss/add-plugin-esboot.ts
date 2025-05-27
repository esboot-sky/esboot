import type { ConfigurationInstance } from '@dz-web/esboot';
import postcssPluginESBoot from '@dz-web/postcss-plugin-esboot';

export const addPostcssPluginESBoot = async (cfg: ConfigurationInstance) => {
  const { useTailwindcss } = cfg.config;

  return postcssPluginESBoot({
    useTailwindcss,
  });
};
