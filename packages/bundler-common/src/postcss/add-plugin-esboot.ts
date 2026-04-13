import type { ConfigurationInstance } from '@dz-web/esboot';
import { resolveTailwindConfig } from '@dz-web/esboot-common/cfg';
import postcssPluginESBoot from '@dz-web/postcss-plugin-esboot';

export async function addPostcssPluginESBoot(cfg: ConfigurationInstance): Promise<any> {
  const { enable, separateImports, version } = resolveTailwindConfig(cfg.config);
  const { isDev } = cfg.config;

  return postcssPluginESBoot({
    useTailwindcss: enable,
    useSeparateTailwindImports: separateImports,
    isDev,
    tailwindVersion: version,
  });
};
