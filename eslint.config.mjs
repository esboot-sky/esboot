import antfu from '@antfu/eslint-config';

export default antfu({
  type: 'lib',
  react: true,
  typescript: true,
  stylistic: {
    semi: true,
    indent: 2,
    singleQuote: true,
    trailingComma: 'all',
    arrowParens: 'always',
  },
}, {
  rules: {
    'antfu/if-newline': 'off',
    'style/if-newline': 'off',
  },
});
