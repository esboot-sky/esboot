import antfu from '@antfu/eslint-config';
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
};

export default async function createConfig(modifyConfig) {
  const config = antfu(
    {
      vue: true,
      react: false,
      typescript: true,
      stylistic: {
        semi: true,
        singleQuote: true,
        trailingComma: 'all',
        arrowParens: 'always',
        printWidth: 120,
        tabWidth: 2,
        useTabs: false,
        endOfLine: 'auto',
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
        ...reactHooks.configs['recommended-latest'].plugins['react-hooks'],
        ...esbootPlugin.configs.recommended.plugins,
      },
      rules: {
        ...esbootPlugin.configs.recommended.rules,
        ...reactHooks.configs['recommended-latest'].rules,
        ...betterTailwindcssRules,
      },
    },
    {
      settings: {
        tailwindcss: {
          variables: ['.*cls'],
          entryPoint: 'src/styles/index.css',
        },
      },
    },
  );

  return modifyConfig ? modifyConfig(config) : config;
}
