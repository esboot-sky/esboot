import { join, resolve } from 'path';
import type { Config } from 'tailwindcss';
import type { Plugin } from '@dz-web/esboot';

import { getAbsolutePath } from '@@/helpers/path';

export const alias = {
  tailwindcss: getAbsolutePath('tailwindcss'),
};

export type CustomTailwindcssPluginOpts = (defaultConfig: Config) => Config;

const defaultOpts = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default (
  customTailwindcssPluginOpts?: CustomTailwindcssPluginOpts
): Plugin => {
  if (
    customTailwindcssPluginOpts &&
    typeof customTailwindcssPluginOpts !== 'function'
  ) {
    throw new Error('customTailwindcssPluginOpts must be a function');
  }

  return {
    key: 'plugin-tailwindcss',
    customWebpack(config: any) {
      const index = config?.module?.rules?.findIndex(
        (item: any) => item?.test?.toString() === '/\\.scss$/'
      );

      if (index === -1) return;

      try {
        config?.module?.rules?.[
          index
        ]?.oneOf[1].use[2].options.postcssOptions.plugins.unshift(
          require('tailwindcss')(
            customTailwindcssPluginOpts
              ? customTailwindcssPluginOpts(defaultOpts)
              : defaultOpts
          )
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
