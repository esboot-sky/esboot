import { join, resolve } from 'path';
import type { Config } from 'tailwindcss';
import type { Plugin } from '@dz-web/esboot';

import { getAbsolutePath } from '@@/helpers/path';

export const alias = {
  tailwindcss: getAbsolutePath('tailwindcss'),
};

export default (cfg: Config): Plugin => {
  return {
    key: 'plugin-tailwindcss',
    customWebpack(config) {
      const index = config?.module?.rules?.findIndex(
        (item) => item?.test?.toString() === '/\\.scss$/'
      );

      if (index === -1) return;

      try {
        config?.module?.rules?.[
          index
        ]?.oneOf[1].use[2].options.postcssOptions.plugins.unshift(
          require('tailwindcss')(cfg)
        );
      } catch (error) {
        console.log(error, '<-- error');
      }

      return config;
    },
    afterCommandOfGenerateAlias: () => ({
      alias,
    }),
  };
};
