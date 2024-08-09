module.exports = {
  $schema: 'http://json.schemastore.org/prettierrc',
  bracketSpacing: true,
  printWidth: 120,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  endOfLine: 'lf',
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
};
