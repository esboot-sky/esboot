// import antfu from '@antfu/eslint-config';
// import esbootPlugin from '@dz-web/eslint-plugin-esboot';
// // import { FlatCompat } from '@eslint/eslintrc';
// import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss';
// import reactHooks from 'eslint-plugin-react-hooks';

// // const compat = new FlatCompat();

// export default async function createConfig() {
//   return antfu(
//     {
//       vue: false,
//       react: true,
//       typescript: true,
//       stylistic: {
//         semi: true,
//         singleQuote: true,
//         trailingComma: 'all',
//         arrowParens: 'always',
//         printWidth: 80,
//         tabWidth: 2,
//         useTabs: false,
//         endOfLine: 'auto',
//         maxLen: 120,
//       },
//       ignores: [
//         '**/node_modules/**',
//         '**/dist/**',
//         '**/build/**',
//         '**/lib/**',
//         '**/.cache/**',
//         '**/coverage/**',
//         '**/.nyc_output/**',
//         '**/stats.html',
//       ],
//     },
//     {
//       files: ['**/*.{jsx,ts,tsx}'],
//       plugins: {
//         'better-tailwindcss': eslintPluginBetterTailwindcss,
//         'react-hooks': reactHooks.configs['recommended-latest'],
//         ...esbootPlugin.configs.recommended.plugins,
//       },
//       rules: {
//         ...eslintPluginBetterTailwindcss.configs['recommended-warn'].rules,
//         ...eslintPluginBetterTailwindcss.configs['recommended-error'].rules,
//         ...esbootPlugin.configs.recommended.rules,
//         ...reactHooks.configs['recommended-latest'].rules,

//         'better-tailwindcss/enforce-consistent-line-wrapping': [
//           'warn',
//           { printWidth: 100 },
//         ],
//         'better-tailwindcss/no-unregistered-classes': 'off',
//       },
//     },
//     {
//       settings: {
//         tailwindcss: {
//           variables: ['.*cls'],
//           entryPoint: 'src/styles/index.css',
//         },
//       },
//     },
//   );
// }
