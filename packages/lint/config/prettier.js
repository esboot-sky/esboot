import { fileURLToPath } from 'node:url';

const resolvePath = (p) => fileURLToPath(import.meta.resolve(p));

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
    resolvePath('prettier-plugin-tailwindcss'),
    resolvePath('prettier-plugin-classnames'),
    resolvePath('prettier-plugin-merge'),
  ],
};
