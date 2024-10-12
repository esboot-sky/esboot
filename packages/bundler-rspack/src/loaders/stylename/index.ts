import { getCssHashRule } from '@/cfg/rules/style/utils';

const {
  generateScopedNameFactory,
} = require('@dz-web/babel-plugin-react-css-modules/utils');

console.log(generateScopedNameFactory, 'generateScopedNameFactory');

const generateScopedName = generateScopedNameFactory(getCssHashRule());
const importPattern =
  /(^|\n)\s*import(?:\s+(.+?)\s+from)?\s+(?:'|")(.+?\.(?:css|scss)(?:\?[^'"]*?)?)(?:'|");?/g;

export default function (this: any, source: string): string {
  // get resourcePath
  const matches = source.matchAll(importPattern);

  for (const match of matches) {
    const [statement, prefixStatement, variable, importPath] = match;

    console.log(statement, prefixStatement, variable, importPath, 'match');
  }

  // match .scss file
  const isScssFile = this.resourcePath.match(/\.scss$/);

  // console.log('resourcePath', resourcePath);
  const className = source.match(/className:\s*"([^"]+)"/)?.[1];
  console.log(className, 'className');

  const replacedSource = source.replace(
    /styleName:\s*"([^"]+)"/g,
    (match, styleNames) => {
      const hashedClassNames = styleNames
        .split(/\s+/)
        .map((styleName: string) => {
          const value = generateScopedName(styleName, '/Users/rocsun/Code/dz-library/esboot-sky/esboot-next/examples/sp-base/src/views/home/app.scss');

          console.log(value, resourcePath, styleName, 'value');
          return value;
        })
        .join(' ');

      return `styleName: "${hashedClassNames}"`;
    }
  );

  return replacedSource;
}
