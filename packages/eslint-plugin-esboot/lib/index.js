module.exports = {
  rules: {
    'no-cross-platform-imports': require('./rules/no-cross-platform-imports'),
    'no-cross-platform-lib-imports': require('./rules/no-cross-platform-lib-imports'),
  },
  configs: {
    recommended: {
      plugins: ['@dz-web/esboot'],
      rules: {
        '@dz-web/esboot/no-cross-platform-imports': 'error',
      },
    },
  },
};
