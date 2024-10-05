import type { ConfigurationInstance } from '@dz-web/esboot';
import { isFunction } from '@dz-web/esboot-common/lodash';
import type { Config } from 'tailwindcss';

const defaultTailwindCSSOpts: Config = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};

export function addTailwindCSS(cfg: ConfigurationInstance) {
  const { useTailwindcss, tailwindcssOptions } = cfg.config;

  if (!useTailwindcss) return false;

  return require('tailwindcss')(
    isFunction(tailwindcssOptions)
      ? tailwindcssOptions(defaultTailwindCSSOpts)
      : defaultTailwindCSSOpts
  );
}
