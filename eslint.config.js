module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // other configurations
  ],
  rules: {
    // your rules
  },
  overrides: [
    {
      files: ['packages/*/src/**/*.ts'],
      rules: {
        'import/order': [
          'error',
          {
            'newlines-between': 'always',
            warnOnUnassignedImports: true,
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
            groups: [
              'builtin',
              'external',
              'internal',
              'parent',
              'sibling',
              'index',
              'object',
              'type',
            ],
          },
        ],
      },
    },
  ],
};
