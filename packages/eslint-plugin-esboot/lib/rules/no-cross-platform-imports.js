const path = require('path');
const { resolve } = require('../helpers/resolver-alias');
const {
  extractPlatformAndType,
} = require('../helpers/extract-platform-and-type');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow imports from other platforms',
      category: 'Best Practices',
      recommended: false,
      url: 'http://esboot.dzfe.net/docs/esboot/eslint/rules#no-cross-platform-imports',
    },
    messages: {
      noImportOtherPlatforms: 'Disallow importing other platforms, {{desc}}',
      noImportLowLevelPlatforms:
        'Disallow importing low-level modules, {{desc}}',
    },
    schema: [],
  },
  create(context) {
    const currentFilename = context.filename;
    const settings = context.settings['import/resolver'].alias;
    const currInfo = extractPlatformAndType(currentFilename);

    function resolveImportPath(importPath) {
      const resolvedPath = resolve(importPath, currentFilename, settings);

      if (resolvedPath.found) {
        return resolvedPath.path;
      }

      return path.resolve(path.dirname(currentFilename), importPath);
    }

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;

        const resolvedPath = resolveImportPath(importPath);
        const importInfo = extractPlatformAndType(resolvedPath);

        // console.log(resolvedPath, importInfo, '<-- import info');
        // console.log(currentFilename, currInfo, '<-- curr ino');
        // When import file is not platfrom's file
        if (!importInfo) return;

        const { platform: currPlatform, pageType: currPageType } =
          currInfo || {};
        const { platform: importPlatform, pageType: importPageType } =
          importInfo || {};

        if (!currPlatform && !importPlatform) return;
        // console.log(currInfo, importInfo, '<--=== ');

        if (!currPlatform && importPlatform) {
          context.report({
            node,
            messageId: 'noImportLowLevelPlatforms',
            data: {
              desc: `You cannot import files from the ${importPlatform} platform here.`,
            },
          });
          return;
        }

        // Not same platform
        if (importPlatform && currPlatform !== importPlatform) {
          context.report({
            node,
            messageId: 'noImportOtherPlatforms',
            data: {
              desc: `You cannot import files from the ${importPlatform} platform here.`,
            },
          });
          return;
        }

        // Import pageType content from within the platform
        if (currPlatform && !currPageType && importPageType) {
          context.report({
            node,
            messageId: 'noImportLowLevelPlatforms',
            data: {
              desc: `You cannot import files from the ${importPageType} pageType here.`,
            },
          });
          return;
        }

        if (currPlatform && importPlatform) {
          if (!importPageType && currPageType) return;

          // Not same pageType
          if (importPageType !== currPageType) {
            context.report({
              node,
              messageId: 'noImportOtherPlatforms',
              data: {
                desc: `You cannot import files from the ${importPageType} pageType here.`,
              },
            });
            return;
          }
        }
      },
    };
  },
};
