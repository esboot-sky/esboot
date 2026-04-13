import type { Node, Result, Root } from 'postcss';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parse } from 'postcss';

import { calculateContentHash } from './helpers';

type TailwindVersion = '3' | 'next';

interface TailwindFileCache {
  content: string;
  mtime: number;
}

interface ProcessedRootCache {
  hash: string;
  processedRoot: Root;
}

const fileCache = new Map<string, ProcessedRootCache>();
const tailwindFileCache = new Map<string, TailwindFileCache>();
const tailwindSignRegex = /ESBOOT_SIGN_TAILWIND_CSS/g;

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

function getTailwindPrelude(tailwindVersion: TailwindVersion, useSeparateTailwindImports: boolean): string {
  console.log('Getting Tailwind CSS prelude for version:', tailwindVersion, 'with separate imports:', useSeparateTailwindImports);
  if (tailwindVersion === '3') {
    return '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n';
  }

  if (useSeparateTailwindImports) {
    const themeCssContent = getTailwindFileContent(
      fileURLToPath(import.meta.resolve('tailwindcss/theme.css')),
    );
    const preflightCssContent = getTailwindFileContent(
      fileURLToPath(import.meta.resolve('tailwindcss/preflight.css')),
    );
    const utilitiesCssContent = getTailwindFileContent(
      fileURLToPath(import.meta.resolve('tailwindcss/utilities.css')),
    );

    return [
      themeCssContent,
      preflightCssContent,
      utilitiesCssContent,
    ].join('\n');
  }

  return getTailwindFileContent(
    fileURLToPath(import.meta.resolve('tailwindcss/index.css')),
  );
}

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
          isEntryFile = cssContent.startsWith('ESBOOT_SIGN_TAILWIND_CSS');
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
        const tailwindPrelude = getTailwindPrelude(tailwindVersion, useSeparateTailwindImports);
        const tailwindRoot = parse(tailwindPrelude, {
          from: filePath || undefined,
        });
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
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('❌ Process Tailwind CSS failed:', errorMessage);
      }

      return root;
    },
  };
};

export const postcss = true;
