import { resolve } from 'node:path';
import { createHash } from 'crypto';

interface AnyObject {
  [key: string]: any;
}

function generateHash(input: string): string {
  return createHash('md5')
    .update(input)
    .digest('base64')
    .replace(/[/+=]/g, '')
    .slice(0, 8);
}

export default function (this: any, source: string): string {
  const replacedSource = source.replace(
    /styleName:\s*"([^"]+)"/g,
    (match, classNames) => {
      const hashedClassNames = classNames
        .split(/\s+/)
        .map((className) => {
          const hash = generateHash(className);
          return `${className}__${hash}`;
        })
        .join(' ');
      return `styleName: "${hashedClassNames}"`;
    }
  );

  return replacedSource;
}
