import { fileURLToPath } from 'node:url';

const resolvePath = (p) => fileURLToPath(import.meta.resolve(p));

export default {
  extends: [resolvePath('stylelint-config-standard')],
  plugins: [
    resolvePath('stylelint-scss'),
    resolvePath('@stylistic/stylelint-plugin'),
  ],
  customSyntax: resolvePath('postcss-scss'),
  ignoreFiles: ['!src/**/*', 'node_modules'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'extend',
          'at-root',
          'debug',
          'warn',
          'error',
          'if',
          'else',
          'for',
          'each',
          'while',
          'mixin',
          'include',
          'content',
          'return',
          'function',
          'use',
          'tailwind',
        ],
      },
    ],
    'selector-max-id': [
      1,
      {
        ignoreContextFunctionalPseudoClasses: [':not', '/^:(h|H)as$/'],
      },
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['global', 'local'] },
    ],
    // non-stylistic rules
    'import-notation': 'string',
    'max-nesting-depth': 3,
    'color-function-notation': 'legacy',

    // Migrated stylistic rules with new plugin prefix
    '@stylistic/declaration-block-semicolon-newline-after': 'always',
    '@stylistic/declaration-block-semicolon-space-before': 'never',
    '@stylistic/no-eol-whitespace': true,
    // newer
    '@stylistic/max-empty-lines': 1,
    '@stylistic/color-hex-case': 'lower',
    '@stylistic/number-leading-zero': 'never',
  },
};
