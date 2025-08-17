import path from 'node:path';

import { extractPlatformAndType } from '../helpers/extract-platform-and-type.js';
import { resolveAlias } from '@dz-web/esboot-common/helpers';

export default {
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
    const currentFilename = context.getFilename();
    const currInfo = extractPlatformAndType(currentFilename);

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        const resolvedPath = resolveAlias({
          targetPath: importPath,
          currentPath: currentFilename,
          tsconfigPath: path.join(process.cwd(), 'tsconfig.json'),
        });
        const importInfo = extractPlatformAndType(resolvedPath);
        // When import file is not platfrom's file
        if (!importInfo) return;

        const { platform: currPlatform, pageType: currPageType } =
          currInfo || {};
        const { platform: importPlatform, pageType: importPageType } =
          importInfo || {};

        console.log(
          'resolvedPath',
          resolvedPath,
          currInfo,
          importInfo,
          currPlatform,
          importPlatform,
          currPageType,
          importPageType
        );

        if (!currPlatform && !importPlatform) return;

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
          console.log('noImportOtherPlatforms', importPlatform, currPlatform);
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
