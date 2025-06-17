import { extractPlatformAndType } from '../helpers/extract-platform-and-type.js';

const optsIdx = {
  mobile: 0,
  pc: 1,
};

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow cross-platform imports of lib',
      category: 'Best Practices',
      recommended: false,
      url: 'http://esboot.dzfe.net/docs/esboot/eslint/rules#no-cross-platform-lib-imports',
    },
    messages: {
      noImportThisLibsWithinTheCurrentPlatform:
        'Disallow importing {{lib}} within the current platform',
    },
    schema: [
      // array [[xx, xx], [xx, xx]]
      {
        type: 'array',
        items: {
          type: 'string',
        },
        uniqueItems: true,
      },
      {
        type: 'array',
        items: {
          type: 'string',
        },
        uniqueItems: true,
      },
    ],
  },
  create(context) {
    const currentFilename = context.getFilename();
    const currInfo = extractPlatformAndType(currentFilename);

    const options = context.options;

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;

        if (importPath[0] === '.') return;
        if (!currInfo) return;

        const { platform: currPlatform } = currInfo || {};
        const libs = options[optsIdx[currPlatform]];

        if (libs?.length) {
          const splitPath = importPath.split('/');
          const pkgPath =
            splitPath[0][0] === '@'
              ? `${splitPath[0]}/${splitPath[1]}`
              : splitPath[0];

          for (const lib of libs) {
            if (pkgPath === lib) {
              context.report({
                node,
                messageId: 'noImportThisLibsWithinTheCurrentPlatform',
                data: {
                  lib,
                },
              });
            }
          }
        }
      },
    };
  },
};
