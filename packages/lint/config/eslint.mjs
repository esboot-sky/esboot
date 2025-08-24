import { FlatCompat } from '@eslint/eslintrc';
import antfu from '@antfu/eslint-config';
import esbootPlugin from '@dz-web/eslint-plugin-esboot';
import reactHooks from 'eslint-plugin-react-hooks';
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss';

const compat = new FlatCompat();

export default async function createConfig() {
  return antfu(
    {
      vue: false,
      react: true,
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
      files: ['**/*.{jsx,ts,tsx}'],
      plugins: {
        'better-tailwindcss': eslintPluginBetterTailwindcss,
        'react-hooks': reactHooks.configs['recommended-latest'],
        ...esbootPlugin.configs['recommended'].plugins,
      },
      rules: {c
        ...eslintPluginBetterTailwindcss.configs['recommended-warn'].rules,
        ...eslintPluginBetterTailwindcss.configs['recommended-error'].rules,
        ...esbootPlugin.configs['recommended'].rules,
        ...reactHooks.configs['recommended-latest'].rules,

        'better-tailwindcss/enforce-consistent-line-wrapping': [
          'warn',
          { printWidth: 100 },
        ],
        'better-tailwindcss/no-unregistered-classes': 'off',
      },
    },
    {
      settings: {
        tailwindcss: {
          variables: ['.*cls'],
          entryPoint: 'src/styles/index.css',
        },
      },
    }
  );
  // return defineConfig([
  //   js.configs.recommended,

  //   // TypeScript files configuration
  //   ...tsEslint.configs.recommended.map((config) => ({
  //     ...config,
  //     files: ['**/*.{ts,tsx}'],
  //   })),

  //   // Base configuration for all JavaScript/TypeScript files
  //   {
  //     files: ['**/*.{js,jsx,ts,tsx}'],
  //     languageOptions: {
  //       globals: {
  //         ...globals.browser,
  //         ...globals.node,
  //         DEBUG: true,
  //       },
  //       parser: tsParser.default,
  //       ecmaVersion: 2023,
  //       sourceType: 'module',
  //       parserOptions: {
  //         ecmaFeatures: {
  //           jsx: true,
  //         },
  //         tsconfigRootDir: '',
  //       },
  //     },
  //     plugins: {
  //       import: importPlugin,
  //       react: reactPlugin,
  //     },
  //     settings: {
  //       'import/resolver': {
  //         node: {
  //           extensions: ['.tsx', '.ts', '.js'],
  //         },
  //         alias: {
  //           map: [],
  //           extensions: ['.ts', '.tsx', '.js', '.jsx'],
  //         },
  //         typescript: {},
  //       },
  //       react: {
  //         version: 'detect',
  //       },
  //     },
  //     rules: {
  //       // Import rules
  //       'import/no-extraneous-dependencies': 0,
  //       'import/no-unresolved': 'error',
  //       'import/prefer-default-export': 0,
  //       'import/extensions': [
  //         'error',
  //         'ignorePackages',
  //         {
  //           js: 'never',
  //           mjs: 'never',
  //           jsx: 'never',
  //           ts: 'never',
  //           tsx: 'never',
  //         },
  //       ],
  //       'import/order': [
  //         'error',
  //         {
  //           'newlines-between': 'always',
  //           warnOnUnassignedImports: true,
  //           alphabetize: {
  //             order: 'asc',
  //             caseInsensitive: true,
  //           },
  //           groups: [
  //             'builtin',
  //             'external',
  //             'internal',
  //             'parent',
  //             'sibling',
  //             'index',
  //             'object',
  //             'type',
  //           ],
  //         },
  //       ],

  //       // General rules
  //       'no-shadow': 'off',
  //       'no-use-before-define': 'off',
  //       'no-underscore-dangle': 0,
  //       'no-param-reassign': 0,
  //       'no-console': 0,
  //       'global-require': 0,
  //       strict: 0,
  //       'prefer-destructuring': 'warn',
  //       'max-len': ['error', 120],
  //       'object-curly-newline': 0,
  //       'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
  //       'no-restricted-syntax': [
  //         'error',
  //         'ForInStatement',
  //         'LabeledStatement',
  //         'WithStatement',
  //       ],

  //       // TypeScript rules
  //       '@typescript-eslint/no-var-requires': 0,
  //       '@typescript-eslint/no-shadow': ['error'],
  //       '@typescript-eslint/explicit-function-return-type': 0,
  //       '@typescript-eslint/ban-ts-comment': 0,
  //       '@typescript-eslint/no-explicit-any': ['off'],

  //       // React rules
  //       'react/jsx-props-no-spreading': 0,
  //       'react/jsx-filename-extension': [
  //         'error',
  //         { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
  //       ],
  //       'react/function-component-definition': [
  //         2,
  //         {
  //           namedComponents: [
  //             'arrow-function',
  //             'function-declaration',
  //             'function-expression',
  //           ],
  //         },
  //       ],
  //       'react/react-in-jsx-scope': 0,
  //       'react/prop-types': 0,
  //       'react/no-unknown-property': ['error', { ignore: ['styleName'] }],
  //       'react/forbid-prop-types': 0,

  //       // React Hooks rules
  //       'react-hooks/exhaustive-deps': 0,

  //       // JSX a11y rules
  //       'jsx-a11y/control-has-associated-label': 0,
  //       'jsx-a11y/href-no-hash': 0,
  //       'jsx-a11y/no-static-element-interactions': 0,
  //       'jsx-a11y/no-noninteractive-element-interactions': 0,
  //       'jsx-a11y/click-events-have-key-events': 0,
  //       'jsx-a11y/anchor-is-valid': 0,
  //       'jsx-a11y/iframe-has-title': 0,
  //       'jsx-a11y/label-has-for': 0,
  //       'jsx-a11y/no-redundant-roles': 0,
  //     },
  //   },

  //   // TypeScript specific configuration
  //   {
  //     files: ['**/*.{ts,tsx}'],
  //     languageOptions: {
  //       parser: tsParser.default,
  //       parserOptions: {
  //         project: join(process.cwd(), './tsconfig.json'),
  //       },
  //     },
  //   },

  //   // Global ignores
  //   {
  //     ignores: [
  //       '**/node_modules/**',
  //       '**/dist/**',
  //       '**/build/**',
  //       '**/lib/**',
  //       '**/.cache/**',
  //       '**/coverage/**',
  //       '**/.nyc_output/**',
  //       '**/stats.html',
  //     ],
  //   },
  // ]);
}
