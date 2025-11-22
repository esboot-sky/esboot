import type { Node, Result, Root } from 'postcss';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parse } from 'postcss';

import { calculateContentHash } from './helpers';

const fileCache = new Map();

interface TailwindFileCache {
  content: string;
  mtime: number;
}

const tailwindFileCache = new Map<string, TailwindFileCache>();

function getTailwindFileContent(filePath: string): string {
  const cached = tailwindFileCache.get(filePath);
  const stats = fs.statSync(filePath);
  const currentMtime = stats.mtimeMs;

  if (cached && cached.mtime === currentMtime) {
    return cached.content;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  tailwindFileCache.set(filePath, {
    content,
    mtime: currentMtime,
  });

  return content;
}

export default async (opts = { useTailwindcss: true, useSeparateTailwindImports: true, isDev: true }): Promise<any> => {
  const { useTailwindcss, useSeparateTailwindImports = true, isDev = true } = opts;
  let tailwindCssPath: string;
  let themeCssPath: string;
  let preflightCssPath: string;
  let utilitiesCssPath: string;

  if (useTailwindcss) {
    if (useSeparateTailwindImports) {
      themeCssPath = fileURLToPath(
        import.meta.resolve('tailwindcss/theme.css'),
      );
      preflightCssPath = fileURLToPath(
        import.meta.resolve('tailwindcss/preflight.css'),
      );
      utilitiesCssPath = fileURLToPath(
        import.meta.resolve('tailwindcss/utilities.css'),
      );
    }
    else {
      tailwindCssPath = fileURLToPath(
        import.meta.resolve('tailwindcss/index.css'),
      );
    }
  }

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
          isEntryFile = cssContent.startsWith('ESBOOT_SIGN_TAILWIND_CSS');
        }

        if (!isEntryFile) {
          return root;
        }

        if (!cssContent) {
          cssContent = root.toString();
        }

        if (!isDev && filePath && cssContent) {
          const currentHash = calculateContentHash(cssContent);

          if (currentHash) {
            const cachedData = fileCache.get(filePath);
            if (cachedData && cachedData.hash === currentHash) {
              try {
                root.removeAll();
                cachedData.processedRoot.each((node: Node) => {
                  root.append(node.clone());
                });

                return root;
              }
              catch {
                fileCache.delete(filePath);
              }
            }
          }
        }

        const commentRegex = /ESBOOT_SIGN_TAILWIND_CSS/g;
        const updatedCssContent = cssContent!.replace(commentRegex, '');

        if (useSeparateTailwindImports) {
          const themeCssContent = getTailwindFileContent(themeCssPath);
          const preflightCssContent = getTailwindFileContent(preflightCssPath);
          const utilitiesCssContent = getTailwindFileContent(utilitiesCssPath);

          const themeRoot = parse(themeCssContent, {
            from: themeCssPath,
          });

          const preflightRoot = parse(preflightCssContent, {
            from: preflightCssPath,
          });

          const utilitiesRoot = parse(utilitiesCssContent, {
            from: utilitiesCssPath,
          });

          const contentRoot = parse(updatedCssContent, {
            from: filePath,
          });

          root.removeAll();

          themeRoot.each((node) => {
            root.append(node.clone());
          });

          preflightRoot.each((node) => {
            root.append(node.clone());
          });

          utilitiesRoot.each((node) => {
            root.append(node.clone());
          });

          contentRoot.each((node) => {
            root.append(node.clone());
          });
        }
        else {
          if (!tailwindCssPath) {
            return root;
          }

          const tailwindCssContent = getTailwindFileContent(tailwindCssPath);

          const tailwindRoot = parse(tailwindCssContent, {
            from: tailwindCssPath,
          });

          const contentRoot = parse(updatedCssContent, {
            from: filePath || tailwindCssPath,
          });

          root.removeAll();

          tailwindRoot.each((node) => {
            root.append(node.clone());
          });

          contentRoot.each((node) => {
            root.append(node.clone());
          });
        }

        if (!isDev && filePath && cssContent) {
          const currentHash = calculateContentHash(cssContent);
          if (currentHash) {
            try {
              fileCache.set(filePath, {
                hash: currentHash,
                processedRoot: root.clone(),
              });
            }
            catch (cacheError: unknown) {
              console.warn(
                '⚠️ Update esboot cache failed:',
                (cacheError as Error).message,
              );
            }
          }
        }
      }
      catch (error) {
        const errorMessage
          = error instanceof Error ? error.message : String(error);
        console.error('❌ Process Tailwind CSS failed:', errorMessage);
      }

      return root;
    },
  };
};

export const postcss = true;
