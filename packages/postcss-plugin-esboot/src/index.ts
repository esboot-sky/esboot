import type { Node, Result, Root } from 'postcss';
import { parse } from 'postcss';

import { calculateContentHash } from './helpers';
import { getTailwindPreludeRoot } from './tailwind-prelude';

type TailwindVersion = '3' | 'next';

interface ProcessedRootCache {
  hash: string;
  processedRoot: Root;
}

const fileCache = new Map<string, ProcessedRootCache>();
const tailwindSignRegex = /ESBOOT_SIGN_TAILWIND_CSS/g;

function getCacheKey(filePath: string, tailwindVersion: TailwindVersion, useSeparateTailwindImports: boolean): string {
  return `${filePath}:${tailwindVersion}:${useSeparateTailwindImports ? 'separate' : 'combined'}`;
}

export default async (opts = {
  useTailwindcss: true,
  useSeparateTailwindImports: true,
  isDev: true,
  tailwindVersion: 'next' as TailwindVersion,
}): Promise<any> => {
  const {
    useTailwindcss,
    useSeparateTailwindImports = true,
    isDev = true,
    tailwindVersion = 'next',
  } = opts;

  return {
    postcssPlugin: 'postcss-plugin-esboot',

    Once(root: Root, { result }: { result: Result }) {
      if (!useTailwindcss) {
        return root;
      }

      try {
        const filePath = result.opts.from;
        let isEntryFile = false;
        let cssContent: string | null = null;

        const firstNode = root.first;
        if (firstNode && firstNode.type === 'comment') {
          const firstComment = firstNode.toString();
          isEntryFile = firstComment.includes('ESBOOT_SIGN_TAILWIND_CSS');
        }

        if (!isEntryFile) {
          cssContent = root.toString();
          isEntryFile = cssContent.includes('ESBOOT_SIGN_TAILWIND_CSS');
        }

        if (!isEntryFile) {
          return root;
        }

        if (!cssContent) {
          cssContent = root.toString();
        }

        const cacheKey = filePath
          ? getCacheKey(filePath, tailwindVersion, useSeparateTailwindImports)
          : '';

        if (!isDev && cacheKey && cssContent) {
          const currentHash = calculateContentHash(cssContent);

          if (currentHash) {
            const cachedData = fileCache.get(cacheKey);
            if (cachedData && cachedData.hash === currentHash) {
              try {
                root.removeAll();
                cachedData.processedRoot.each((node: Node) => {
                  root.append(node.clone());
                });

                return root;
              }
              catch {
                fileCache.delete(cacheKey);
              }
            }
          }
        }

        const updatedCssContent = cssContent.replace(tailwindSignRegex, '');
        const { root: tailwindRoot } = getTailwindPreludeRoot(
          tailwindVersion,
          useSeparateTailwindImports,
          filePath || undefined,
        );
        const contentRoot = parse(updatedCssContent, {
          from: filePath || undefined,
        });

        root.removeAll();

        tailwindRoot.each((node) => {
          root.append(node.clone());
        });

        contentRoot.each((node) => {
          root.append(node.clone());
        });

        if (!isDev && cacheKey && cssContent) {
          const currentHash = calculateContentHash(cssContent);
          if (currentHash) {
            try {
              fileCache.set(cacheKey, {
                hash: currentHash,
                processedRoot: root.clone(),
              });
            }
            catch {
              // Cache writes are best-effort.
            }
          }
        }
      }
      catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('❌ Process Tailwind CSS failed:', errorMessage);
      }

      return root;
    },
  };
};

export const postcss = true;
