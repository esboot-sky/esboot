export default {
  $schema: 'http://json.schemastore.org/prettierrc',
  bracketSpacing: true,
  printWidth: 120,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  endOfLine: 'lf',
  endingPosition: 'absolute-with-indent',
  customFunctions: ['clsx', 'cn', 'cva'],
  plugins: [
    import.meta.resolve('prettier-plugin-tailwindcss'),
    import.meta.resolve('prettier-plugin-classnames'),
    import.meta.resolve('prettier-plugin-merge'),
  ],
};
