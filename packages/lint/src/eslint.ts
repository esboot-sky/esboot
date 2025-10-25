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
        overrides: {
          'style/max-len': ['error', { code: 120 }],
        },
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
      files: ['**/lang/*.{json,jsonc}'],
      rules: {
        'jsonc/key-name-casing': ['error', {
          'camelCase': false,
          'PascalCase': false,
          'SCREAMING_SNAKE_CASE': false,
          'kebab-case': false,
          'snake_case': true,
          'ignores': [],
        }],
      },
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
        'react/no-missing-context-display-name': 'error',
        'react/no-missing-component-display-name': 'error',
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
