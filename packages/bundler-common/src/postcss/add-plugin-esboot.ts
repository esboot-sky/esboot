import type { ConfigurationInstance } from '@dz-web/esboot';
import postcssPluginESBoot from '@dz-web/postcss-plugin-esboot';

export async function addPostcssPluginESBoot(cfg: ConfigurationInstance): Promise<any> {
  const { useTailwindcss } = cfg.config;

  return postcssPluginESBoot({
    useTailwindcss,
  });
};
