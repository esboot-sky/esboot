import antfu from '@antfu/eslint-config';
// @ts-ignore
import esbootPlugin from '@dz-web/eslint-plugin-esboot';
// import { FlatCompat } from '@eslint/eslintrc';
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss';
import reactHooks from 'eslint-plugin-react-hooks';

// const compat = new FlatCompat();

const betterTailwindcssRules = {
  ...eslintPluginBetterTailwindcss.configs['recommended-warn'].rules,
  ...eslintPluginBetterTailwindcss.configs['recommended-error'].rules,

  'better-tailwindcss/enforce-consistent-line-wrapping': [
    'warn',
    { printWidth: 100 },
  ],
  'better-tailwindcss/no-unregistered-classes': 'off',
} as any;

type Config = ReturnType<typeof antfu>;

interface Options {
  react: boolean;
  vue: boolean;
}

export default async function createConfig(options?: Options): Promise<Config> {
  const { react = true, vue = false } = options || {};

  const config = antfu(
    {
      vue,
      react,
      typescript: true,
      stylistic: {
        semi: true,
        quotes: 'single',
        indent: 2,
        // trailingComma: 'all',
        // arrowParens: 'always',
        // printWidth: 120,
        // tabWidth: 2,
        // useTabs: false,
        // endOfLine: 'auto',
      },
      ignores: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/lib/**',
        '**/.cache/**',
        '**/coverage/**',
        '**/.nyc_output/**',
        '**/stats.html',
      ],
    },
    {
      files: ['**/*.{vue}'],
      plugins: {
        'better-tailwindcss': eslintPluginBetterTailwindcss,
      },
      rules: {
        ...betterTailwindcssRules,
      },
    },
    {
      files: ['**/*.{jsx,ts,tsx}'],
      plugins: {
        'better-tailwindcss': eslintPluginBetterTailwindcss,
        'react-hooks': reactHooks,
        '@dz-web/esboot': esbootPlugin,
      },
      rules: {
        ...esbootPlugin.configs.recommended.rules,
        ...reactHooks.configs['recommended-latest'].rules,
        ...betterTailwindcssRules,
      },
    },
    {
      settings: {
        'better-tailwindcss': {
          variables: ['.*cls'],
          entryPoint: 'src/styles/index.scss',
        },
      },
    },
  );

  // return modifyConfig ? modifyConfig(config) : config;
  return config;
}
